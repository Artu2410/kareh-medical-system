const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Obtener todos los profesionales
router.get('/', async (req, res) => {
  try {
    const professionals = await prisma.professional.findMany({
      orderBy: { firstName: 'asc' }
    });
    res.json(professionals);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
