/**
 * Editar evolución clínica
 */
async function updateEvolution(evolutionId, data) {
  // Solo campos SOAP, dolor, notas, diagnosis, fecha
  return prisma.evolution.update({
    where: { id: evolutionId },
    data: {
      subjective: data.subjective,
      objective: data.objective,
      assessment: data.assessment,
      plan: data.plan,
      pain_scale: data.pain_scale,
      notes: data.notes,
      diagnosis: data.diagnosis,
      date: data.date,
    }
  });
}

/**
 * Borrar evolución clínica
 */
async function deleteEvolution(evolutionId) {
  return prisma.evolution.delete({ where: { id: evolutionId } });
}
const prisma = require('../prismaClient');

/**
 * Registrar evolución de una cita
 * Se vincula automáticamente a la historia clínica del paciente
 */
async function createEvolution(appointmentId, professionalId, notes) {
  if (!appointmentId || !professionalId) {
    throw new Error('appointmentId y professionalId son requeridos');
  }

  const evolution = await prisma.$transaction(async (tx) => {
    // Validar que la cita existe
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true }
    });

    if (!appointment) {
      throw new Error('Cita no encontrada');
    }

    if (appointment.professionalId !== professionalId) {
      throw new Error('Solo el profesional asignado puede registrar evoluciones');
    }

    // Crear evolución
    const evolution = await tx.evolution.create({
      data: {
        appointmentId,
        professionalId,
        notes: notes || ''
      },
      include: {
        appointment: {
          include: {
            patient: true,
            professional: true
          }
        }
      }
    });

    // Actualizar estado de la cita a "COMPLETED"
    await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' }
    });

    return evolution;
  });

  return evolution;
}

/**
 * Obtener evoluciones de un paciente (historia clínica completa)
 */
async function getPatientEvolutions(patientId) {
  const evolutions = await prisma.evolution.findMany({
    where: {
      appointment: {
        patientId
      }
    },
    include: {
      appointment: {
        include: {
          professional: true,
          patient: true
        }
      },
      professional: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return evolutions;
}

/**
 * Obtener historial médico de un paciente
 */
async function getPatientMedicalHistory(patientId) {
  const history = await prisma.medicalHistory.findFirst({
    where: { patientId },
    include: {
      diagnoses: {
        orderBy: { createdAt: 'desc' }
      },
      patient: {
        include: {
          appointments: {
            include: {
              professional: true,
              evolutions: true
            },
            orderBy: { date: 'desc' }
          }
        }
      }
    }
  });

  return history;
}

/**
 * Agregar nuevo diagnóstico a historia clínica
 */
async function addDiagnosis(patientId, description) {
  if (!patientId || !description) {
    throw new Error('patientId y description son requeridos');
  }

  let history = await prisma.medicalHistory.findFirst({
    where: { patientId }
  });

  if (!history) {
    history = await prisma.medicalHistory.create({
      data: { patientId }
    });
  }

  const diagnosis = await prisma.diagnosis.create({
    data: {
      historyId: history.id,
      description: description.trim()
    }
  });

  return diagnosis;
}

module.exports = {
  createEvolution,
  getPatientEvolutions,
  getPatientMedicalHistory,
  addDiagnosis,
  updateEvolution,
  deleteEvolution
};
