const prisma = require('../prismaClient');

const createPatient = async (patientData) => {
  return prisma.patient.create({
    data: patientData,
  });
};

const getPatients = async () => {
  return prisma.patient.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getPatientById = async (id) => {
  return prisma.patient.findUnique({
    where: { id: parseInt(id) },
  });
};

const updatePatient = async (id, patientData) => {
  return prisma.patient.update({
    where: { id: parseInt(id) },
    data: patientData,
  });
};

const deletePatient = async (id) => {
  return prisma.patient.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
