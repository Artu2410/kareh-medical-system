const prisma = require('../prismaClient');

const updatePatient = async (id, patientData) => {
  // Limpiamos y mapeamos los datos para que coincidan con schema.prisma
  const cleanData = {
    firstName: patientData.firstName || patientData.nombre || "",
    lastName: patientData.lastName || patientData.apellido || "",
    dni: String(patientData.dni),
    // Resolvemos la inconsistencia: acepta 'dob' o 'birthDate'
    dob: patientData.dob ? new Date(patientData.dob) : 
         patientData.birthDate ? new Date(patientData.birthDate) : undefined,
    email: patientData.email || null,
    gender: patientData.gender || "M",
    phone: patientData.phone || null,
    address: patientData.address || null,
    hasCancer: Boolean(patientData.hasCancer),
    hasPacemaker: Boolean(patientData.hasPacemaker),
    hasBypass: Boolean(patientData.hasBypass),
    socialWorkId: patientData.socialWorkId || null,
  };

  // Eliminamos campos undefined para evitar errores de validación de Prisma
  Object.keys(cleanData).forEach(key => cleanData[key] === undefined && delete cleanData[key]);

  return prisma.patient.update({
    where: { id: id },
    data: cleanData,
  });
};

const createPatient = async (patientData) => {
  return prisma.patient.create({
    data: {
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      dni: String(patientData.dni),
      dob: new Date(patientData.dob || patientData.birthDate),
      email: patientData.email || null,
      gender: patientData.gender || "M",
      phone: patientData.phone || null,
      address: patientData.address || null,
      hasCancer: Boolean(patientData.hasCancer),
      hasPacemaker: Boolean(patientData.hasPacemaker),
      hasBypass: Boolean(patientData.hasBypass),
      socialWorkId: patientData.socialWorkId || null,
    },
  });
};

module.exports = {
  getPatients: async () => prisma.patient.findMany({ orderBy: { createdAt: 'desc' } }),
  createPatient,
  updatePatient,
  deletePatient: async (id) => prisma.patient.delete({ where: { id: id } }),
};