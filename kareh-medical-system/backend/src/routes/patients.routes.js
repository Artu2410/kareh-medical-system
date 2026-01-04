const express = require('express');
const router = express.Router();
const { createPatient, getPatients, getPatientById, updatePatient, deletePatient, searchPatientByDni } = require('../services/patients.service');

// Obtener todos los pacientes
router.get('/', async (req, res) => {
  try {
    const patients = await getPatients();
    res.json(patients);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buscar por DNI
router.get('/search', async (req, res) => {
  try {
    const { dni } = req.query;
    const patient = await searchPatientByDni(dni);
    if (!patient) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Crear nuevo paciente
router.post('/', async (req, res) => {
  try {
    const result = await createPatient(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar paciente existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updatePatient(id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar paciente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deletePatient(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
