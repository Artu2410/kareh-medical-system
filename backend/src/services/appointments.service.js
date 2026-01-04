const prisma = require('../prismaClient');

const MAX_APPOINTMENTS_PER_SLOT = parseInt(process.env.MAX_APPOINTMENTS_PER_SLOT || '5', 10);
const PACKAGE_SIZE = parseInt(process.env.PACKAGE_SIZE || '10', 10);

/**
 * Crear turno(s) con validaciones críticas
 * - Máximo 5 citas por slot/profesional
 * - Soporte para paquetes de 10 sesiones
 * - Crear historia clínica automáticamente
 * - Transacción serializable para evitar race conditions
 */
async function createAppointments(payload) {
  const {
    patient: patientData,
    professionalId,
    therapyType = 'FKT',
    appointmentType = 'single',
    dates,
    diagnosis
  } = payload;

  // Validaciones básicas
  if (!professionalId || typeof professionalId !== 'string') {
    throw new Error('professionalId es requerido y debe ser string');
  }

  if (!patientData || typeof patientData !== 'object') {
    throw new Error('Datos del paciente requeridos');
  }

  if (!Array.isArray(dates) || dates.length === 0) {
    throw new Error('Se debe enviar al menos una fecha en el arreglo `dates`');
  }

  if (appointmentType === 'package' && dates.length !== PACKAGE_SIZE) {
    throw new Error(`Los paquetes deben incluir exactamente ${PACKAGE_SIZE} fechas`);
  }

  // Normalizar y validar fechas
  const normalizedSlots = dates.map(d => {
    const date = new Date(d);
    if (isNaN(date.getTime())) {
      throw new Error(`Fecha inválida: ${d}`);
    }
    return date.toISOString();
  });

  // Ejecutar en transacción serializable para evitar race conditions
  const result = await prisma.$transaction(
    async (tx) => {
      // Validar profesional existe
      const professional = await tx.professional.findUnique({
        where: { id: professionalId }
      });
      if (!professional) {
        throw new Error('Profesional no encontrado');
      }

      // Upsert paciente por DNI (clave única)
      if (!patientData.dni) {
        throw new Error('DNI del paciente es obligatorio');
      }

      const patient = await tx.patient.upsert({
        where: { dni: patientData.dni },
        update: {
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          dob: new Date(patientData.dob),
          phone: patientData.phone || null,
          address: patientData.address || null,
          hasCancer: !!patientData.hasCancer,
          hasPacemaker: !!patientData.hasPacemaker,
          hasBypass: !!patientData.hasBypass,
          socialWorkId: patientData.socialWorkId || null
        },
        create: {
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          dni: patientData.dni,
          dob: new Date(patientData.dob),
          phone: patientData.phone || null,
          address: patientData.address || null,
          hasCancer: !!patientData.hasCancer,
          hasPacemaker: !!patientData.hasPacemaker,
          hasBypass: !!patientData.hasBypass,
          socialWorkId: patientData.socialWorkId || null
        }
      });

      // VALIDAR DISPONIBILIDAD PARA CADA FECHA
      // Esta es la validación crítica: máximo 5 citas por slot
      const conflictingSlots = [];
      for (const slot of normalizedSlots) {
        const count = await tx.appointment.count({
          where: {
            professionalId,
            slot,
            status: { in: ['SCHEDULED', 'CONFIRMED'] }
          }
        });
        if (count >= MAX_APPOINTMENTS_PER_SLOT) {
          conflictingSlots.push(slot);
        }
      }

      if (conflictingSlots.length > 0) {
        throw new Error(
          `Cupos agotados para los horarios: ${conflictingSlots.join(', ')}. Máximo permitido: ${MAX_APPOINTMENTS_PER_SLOT}`
        );
      }

      // Crear o asegurarse de que exista una historia clínica
      let history = await tx.medicalHistory.findFirst({
        where: { patientId: patient.id }
      });
      if (!history) {
        history = await tx.medicalHistory.create({
          data: { patientId: patient.id }
        });
      }

      // Si hay diagnóstico inicial, registrar en historia clínica
      if (diagnosis && diagnosis.trim()) {
        await tx.diagnosis.create({
          data: {
            historyId: history.id,
            description: diagnosis.trim()
          }
        });
      }

      // Crear PackageGroup si es paquete de 10
      let packageGroup = null;
      if (appointmentType === 'package') {
        packageGroup = await tx.packageGroup.create({
          data: { patientId: patient.id }
        });
      }

      // CREAR TODOS LOS TURNOS
      const created = [];
      for (let i = 0; i < normalizedSlots.length; i++) {
        const isoSlot = normalizedSlots[i];
        const isFirstSession = appointmentType === 'package' ? i === 0 : true;

        const appt = await tx.appointment.create({
          data: {
            patientId: patient.id,
            professionalId,
            date: new Date(isoSlot),
            slot: isoSlot,
            therapyType,
            appointmentType,
            diagnosis: diagnosis || null,
            isFirstSession,
            packageGroupId: packageGroup?.id || null
          }
        });
        created.push(appt);
      }

      return {
        success: true,
        patient,
        history,
        packageGroup,
        appointments: created,
        message: `${created.length} turno(s) creado(s) exitosamente`
      };
    },
    {
      isolationLevel: 'Serializable',
      timeout: 10000
    }
  );

  return result;
}

/**
 * Obtener disponibilidad de un profesional en un rango de fechas
 */
async function getAvailability(professionalId, startDate, endDate) {
  if (!professionalId) {
    throw new Error('professionalId es requerido');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Fechas inválidas');
  }

  const appointments = await prisma.appointment.groupBy({
    by: ['slot'],
    where: {
      professionalId,
      date: {
        gte: start,
        lte: end
      },
      status: { in: ['SCHEDULED', 'CONFIRMED'] }
    },
    _count: { id: true }
  });

  // Construir mapa de disponibilidad
  const availability = {};
  appointments.forEach(({ slot, _count }) => {
    availability[slot] = {
      count: _count.id,
      available: MAX_APPOINTMENTS_PER_SLOT - _count.id,
      isFull: _count.id >= MAX_APPOINTMENTS_PER_SLOT
    };
  });

  return availability;
}

/**
 * Buscar paciente por DNI
 */
async function searchPatientByDni(dni) {
  if (!dni || typeof dni !== 'string') {
    throw new Error('DNI requerido');
  }

  const patient = await prisma.patient.findUnique({
    where: { dni: dni.trim() },
    include: {
      histories: {
        include: {
          diagnoses: true
        }
      },
      appointments: {
        include: {
          professional: true
        },
        orderBy: { date: 'desc' },
        take: 10
      }
    }
  });

  return patient;
}

/**
 * Obtener citas de un paciente
 */
async function getPatientAppointments(patientId) {
  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    include: {
      professional: true,
      packageGroup: true,
      evolutions: true
    },
    orderBy: { date: 'asc' }
  });

  return appointments;
}

module.exports = {
  createAppointments,
  getAvailability,
  searchPatientByDni,
  getPatientAppointments
};
