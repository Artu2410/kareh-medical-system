const appointmentService = require('../services/appointments.service');

/**
 * Maneja la creación de turnos (Individual o Plan de 10)
 * POST /api/appointments
 */
const handleCreateAppointment = async (req, res) => {
  try {
    // El payload esperado incluye: patient, professionalId, dates, appointmentType, diagnosis
    const result = await appointmentService.createAppointments(req.body);
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error en handleCreateAppointment:', error);
    
    // Si es un error de validación de cupos (los 5 lugares libres)
    if (error.message.includes('Cupos agotados') || error.message.includes('Fecha inválida')) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Error interno al procesar la agenda',
      details: error.message 
    });
  }
};

/**
 * Obtener disponibilidad de horarios
 * GET /api/appointments/availability
 */
const handleGetAvailability = async (req, res) => {
  try {
    const { professionalId, startDate, endDate } = req.query;
    
    if (!professionalId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Faltan parámetros de consulta' });
    }

    const availability = await appointmentService.getAvailability(professionalId, startDate, endDate);
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Buscar paciente por DNI para el Paso 1 del Wizard
 * GET /api/appointments/patient-search/:dni
 */
const handleSearchPatientByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const patient = await appointmentService.searchPatientByDni(dni);
    
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleCreateAppointment,
  handleGetAvailability,
  handleSearchPatientByDni
};