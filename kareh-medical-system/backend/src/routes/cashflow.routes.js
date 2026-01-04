const express = require('express');
const router = express.Router();
const { getCashFlows, getCashBalance, createCashFlow } = require('../services/cashflow.service');

// Obtener movimientos de caja con filtros de fecha
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const flows = await getCashFlows(startDate, endDate);
    res.json(flows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await getCashBalance();
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear movimiento de caja
router.post('/', async (req, res) => {
  try {
    const result = await createCashFlow(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
