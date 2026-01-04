const express = require('express');
const router = express.Router();

// 1. Verifica que el nombre coincida con tu archivo en la carpeta controllers
const appointmentController = require('../controllers/appointments.controller'); 

// 2. Esta ruta es VITAL para que la agenda cargue los datos al inicio
router.get('/', appointmentController.handleGetAppointments); 

// 3. Estas son las rutas que ya tenías
router.post('/', appointmentController.handleCreateAppointment);
router.get('/availability', appointmentController.handleGetAvailability);
router.get('/patient-search/:dni', appointmentController.handleSearchPatientByDni);

module.exports = router;