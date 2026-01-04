const express = require('express');
const router = express.Router();
const { createEvolution, getPatientEvolutions, getPatientMedicalHistory, addDiagnosis, updateEvolution, deleteEvolution } = require('../services/evolution.service');
// Editar evolución
router.put('/:id', async (req, res) => {
  try {
    const result = await updateEvolution(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Borrar evolución
router.delete('/:id', async (req, res) => {
  try {
    await deleteEvolution(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Crear evolución
router.post('/', async (req, res) => {
  try {
    const result = await createEvolution(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener evoluciones de un paciente
router.get('/by-patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const evolutions = await getPatientEvolutions(patientId);
    res.json(evolutions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener historia médica de un paciente
router.get('/history/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const history = await getPatientMedicalHistory(patientId);
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Agregar diagnóstico
router.post('/diagnosis', async (req, res) => {
  try {
    const result = await addDiagnosis(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
