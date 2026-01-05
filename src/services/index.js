// src/services/index.js

// Pacientes
export * from './patients.service';

// Citas (Exportación explícita para evitar errores de Vite)
export { 
  addAppointment,
  createAppointment,
  getAppointments,
  getAppointmentsByDate,
  getAppointmentsByDoctor,
  getAppointmentSlots,
  updateAppointment,
  deleteAppointment,
  getAvailability, 
  searchPatientByDni, 
  getPatientAppointments,
  createEvolution,
  addDiagnosis
} from './appointments.service';

// Otros
export * from './cashflow.service';
export * from './stats.service';
export * from './audit.service';