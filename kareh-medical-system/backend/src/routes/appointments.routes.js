const express = require('express');
const router = express.Router();
const { createAppointments, getAvailability, searchPatientByDni, getPatientAppointments } = require('../services/appointments.service');
const prisma = require('../prismaClient');

// Crear cita
router.post('/', async (req, res) => {
  try {
    const result = await createAppointments(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar citas (con filtros)
router.get('/', async (req, res) => {
  try {
    const { date, patientId } = req.query;
    let where = {};
    if (date) {
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);
      where.date = { gte: startDate, lte: endDate };
    }
    if (patientId) where.patientId = patientId;
    const appointments = await prisma.appointment.findMany({
      where,
      include: { patient: true, professional: true },
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buscar paciente por DNI (útil para wizard)
router.get('/search-patient', async (req, res) => {
  try {
    const { dni } = req.query;
    const patient = await searchPatientByDni(dni);
    if (!patient) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Citas de un paciente
router.get('/by-patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await getPatientAppointments(patientId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
