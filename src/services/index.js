export { 
  createAppointment,
  addAppointment,
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
} from './appointments.service'
export { createCashFlow, getCashFlows, getCashBalance } from './cashflow.service'
export { getPatients, getPatientById, searchPatients, addPatient, updatePatient, deletePatient, getPatientsByStatus } from './patients.service'
export { getStats, getAppointmentStats, getPatientDemographics, getAppointmentStatusStats, getTrendData } from './stats.service'
export { logAudit, getAuditLogs, getAuditLogsByResource, deleteAuditLog, clearAuditLogs } from './audit.service'
