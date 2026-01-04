// src/services/index.js

// Pacientes (Sincronizado con el archivo que acabamos de corregir)
export { 
  getPatients, 
  getPatientById, 
  searchPatients, 
  addPatient, 
  updatePatient, 
  deletePatient, 
  getPatientsByStatus 
} from './patients.service';

// Citas / Agenda
export { 
  addAppointment, // Usualmente usamos uno de los dos, verifica tu archivo .js
  getAppointmentSlots,
  getAppointments,
  getAppointmentsByDate,
  getAppointmentsByDoctor,
  updateAppointment,
  deleteAppointment,
  getAvailability, 
  searchPatientByDni, 
  getPatientAppointments,
  createEvolution,
  addDiagnosis,
} from './appointments.service';

// Caja Chica
export { createCashFlow, getCashFlows, getCashBalance } from './cashflow.service';

// Estadísticas
export { getStats, getAppointmentStats, getPatientDemographics, getAppointmentStatusStats, getTrendData } from './stats.service';

// Auditoría
export { logAudit, getAuditLogs, getAuditLogsByResource, deleteAuditLog, clearAuditLogs } from './audit.service';