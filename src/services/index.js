export { getAppointments, getAppointmentsByDate, getAppointmentsByDoctor, addAppointment, updateAppointment, deleteAppointment, getAppointmentSlots } from './appointments.service'
export { getPatients, getPatientById, searchPatients, addPatient, updatePatient, deletePatient, getPatientsByStatus } from './patients.service'
export { getStats, getAppointmentStats, getPatientDemographics, getAppointmentStatusStats, getTrendData } from './stats.service'
export { logAudit, getAuditLogs, getAuditLogsByResource, deleteAuditLog, clearAuditLogs } from './audit.service'
