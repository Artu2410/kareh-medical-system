const express = require('express');
const router = express.Router();
// Importamos el servicio donde está la lógica de Prisma
const cashFlowService = require('../services/cashflow.service');

/**
 * RUTA: Obtener flujos (GET /api/cashflow)
 */
router.get('/', async (req, res) => {
  try {
    // Capturamos los datos que vienen del frontend (?startDate=...&endDate=...)
    const { startDate, endDate, type } = req.query;

    const flows = await cashFlowService.getCashFlows({
      startDate,
      endDate,
      type
    });

    res.json(flows);
  } catch (error) {
    console.error('Error al obtener flujos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * RUTA: Crear flujo (POST /api/cashflow)
 */
router.post('/', async (req, res) => {
  try {
    const { type, amount, concept, method, notes, category, receipt } = req.body;

    const professionalId = req.user?.id || null;

    const newFlow = await cashFlowService.createCashFlow(
      type,
      amount,
      concept,
      method,
      professionalId,
      notes,
      category,
      receipt,
      req.body.date || null
    );

    res.status(201).json(newFlow);
  } catch (error) {
    console.error('Error al crear flujo:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;