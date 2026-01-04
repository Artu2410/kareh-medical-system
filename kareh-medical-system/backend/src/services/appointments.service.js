const prisma = require('../prismaClient');
const { format } = require('date-fns'); // Asegúrate de tener date-fns instalado en el backend

const MAX_APPOINTMENTS_PER_SLOT = parseInt(process.env.MAX_APPOINTMENTS_PER_SLOT || '5', 10);
const PACKAGE_SIZE = parseInt(process.env.PACKAGE_SIZE || '10', 10);

/**
 * Crear turno(s) con validaciones críticas
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

  if (!professionalId) throw new Error('professionalId es requerido');
  if (!patientData?.dni) throw new Error('DNI del paciente es obligatorio');
  if (!Array.isArray(dates) || dates.length === 0) throw new Error('Se requiere al menos una fecha');
  
  if (appointmentType === 'package' && dates.length !== PACKAGE_SIZE) {
    throw new Error(`Los paquetes deben incluir exactamente ${PACKAGE_SIZE} sesiones`);
  }

  return await prisma.$transaction(async (tx) => {
    // A. Upsert del Paciente
    const patient = await tx.patient.upsert({
      where: { dni: patientData.dni },
      update: {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        phone: patientData.phone,
        socialWorkId: patientData.socialWorkId
      },
      create: {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        dni: patientData.dni,
        dob: patientData.dob ? new Date(patientData.dob) : null,
        phone: patientData.phone,
        socialWorkId: patientData.socialWorkId
      }
    });

    // B. Validar Disponibilidad de Slots
    const conflictingSlots = [];
    for (const d of dates) {
      const slotDate = new Date(d);
      const count = await tx.appointment.count({
        where: {
          professionalId,
          slot: slotDate.toISOString(),
          status: { in: ['SCHEDULED', 'CONFIRMED'] }
        }
      });
      if (count >= MAX_APPOINTMENTS_PER_SLOT) {
        conflictingSlots.push(format(slotDate, 'dd/MM HH:mm'));
      }
    }

    if (conflictingSlots.length > 0) {
      throw new Error(`Sin cupos en: ${conflictingSlots.join(', ')}`);
    }

    // C. Historia Clínica e Diagnóstico
    const history = await tx.medicalHistory.upsert({
      where: { patientId: patient.id },
      update: {},
      create: { patientId: patient.id }
    });

    if (diagnosis?.trim()) {
      await tx.diagnosis.create({
        data: { historyId: history.id, description: diagnosis.trim() }
      });
    }

    // D. Grupo de Paquete
    let packageGroup = null;
    if (appointmentType === 'package') {
      packageGroup = await tx.packageGroup.create({
        data: { patientId: patient.id }
      });
    }

    // E. Creación de los Turnos
    const createdAppointments = [];
    for (let i = 0; i < dates.length; i++) {
      const dateObj = new Date(dates[i]);
      const appt = await tx.appointment.create({
        data: {
          patientId: patient.id,
          professionalId,
          date: dateObj,
          slot: dateObj.toISOString(),
          therapyType,
          appointmentType,
          diagnosis: diagnosis || null,
          isFirstSession: i === 0,
          packageGroupId: packageGroup?.id || null,
          status: 'SCHEDULED'
        }
      });
      createdAppointments.push(appt);
    }

    return {
      success: true,
      patient,
      appointments: createdAppointments,
      message: `${createdAppointments.length} sesiones agendadas correctamente.`
    };
  }, { isolationLevel: 'Serializable' });
}

/**
 * Obtiene los "slots" (franjas horarias) que ya no tienen cupo para un profesional en un rango de fechas.
 * Un slot se considera lleno si el número de citas programadas alcanza MAX_APPOINTMENTS_PER_SLOT.
 */
async function getAvailability(professionalId, startDate, endDate) {
  if (!professionalId || !startDate || !endDate) {
    throw new Error('Se requieren professionalId, startDate y endDate.');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const appointmentsInPeriod = await prisma.appointment.findMany({
    where: {
      professionalId,
      date: {
        gte: start,
        lte: end,
      },
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
    select: {
      slot: true,
    },
  });

  // Contamos cuántas citas hay en cada slot
  const slotCounts = appointmentsInPeriod.reduce((acc, app) => {
    acc[app.slot] = (acc[app.slot] || 0) + 1;
    return acc;
  }, {});

  // Filtramos los slots que han alcanzado o superado el máximo de citas
  const unavailableSlots = Object.keys(slotCounts).filter(
    (slot) => slotCounts[slot] >= MAX_APPOINTMENTS_PER_SLOT
  );

  return unavailableSlots;
}

/**
 * Buscar paciente por DNI
 */
async function searchPatientByDni(dni) {
  return await prisma.patient.findUnique({
    where: { dni },
    include: { socialWork: true }
  });
}

/**
 * Obtener turnos de un paciente
 */
async function getPatientAppointments(patientId) {
  return await prisma.appointment.findMany({
    where: { patientId },
    orderBy: { date: 'desc' }
  });
}

// EXPORTACIÓN UNIFICADA
module.exports = {
  createAppointments,
  getAvailability,
  searchPatientByDni,
  getPatientAppointments
};