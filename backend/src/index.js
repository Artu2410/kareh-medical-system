require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { 
  createAppointments, 
  getAvailability,
  searchPatientByDni,
  getPatientAppointments
} = require('./services/appointments.service');
const {
  createEvolution,
  getPatientEvolutions,
  getPatientMedicalHistory,
  addDiagnosis
} = require('./services/evolution.service');
const {
  createCashFlow,
  getCashBalance,
  getCashFlows
} = require('./services/cashflow.service');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} = require('./services/patients.service');
const { authenticate } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Health check (sin autenticación)
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Diagnóstico de base de datos
app.get('/api/health/db', async (req, res) => {
  try {
    const prisma = require('./prismaClient');
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      ok: true,
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      ok: false,
      database: 'disconnected',
      error: err.message
    });
  }
});

// ============ ENDPOINTS DE CITAS ============

/**
 * POST /api/appointments
 * Crear turno(s) - máximo 5 por slot, soporte para paquetes de 10
 */
app.post('/api/appointments', authenticate, async (req, res) => {
  try {
    const result = await createAppointments(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('[ERROR] Crear cita:', err.message);
    res.status(400).json({ 
      error: err.message,
      code: 'APPOINTMENT_ERROR'
    });
  }
});

/**
 * GET /api/appointments
 * Obtener citas (con filtros opcionales por fecha o paciente)
 */
app.get('/api/appointments', authenticate, async (req, res) => {
  try {
    const { date, patientId } = req.query;
    
    // Obtener todas las citas y filtrar en memoria
    const prisma = require('./prismaClient');
    let where = {};
    
    if (date) {
      const startDate = new Date(date + 'T00:00:00Z');
      const endDate = new Date(date + 'T23:59:59Z');
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }
    
    if (patientId) {
      where.patientId = patientId;
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        professional: true,
        evolutions: true,
        packageGroup: true
      },
      orderBy: { date: 'asc' }
    });
    
    res.json(appointments);
  } catch (err) {
    console.error('[ERROR] Obtener citas:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/availability
 * Obtener disponibilidad para un profesional en un rango de fechas
 */
app.get('/api/availability', authenticate, async (req, res) => {
  try {
    const { professionalId, startDate, endDate } = req.query;
    
    if (!professionalId || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Parámetros requeridos: professionalId, startDate, endDate' 
      });
    }

    const availability = await getAvailability(professionalId, startDate, endDate);
    res.json({ availability });
  } catch (err) {
    console.error('[ERROR] Obtener disponibilidad:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/patients/search
 * Buscar paciente por DNI
 */
app.get('/api/patients/search', authenticate, async (req, res) => {
  try {
    const { dni } = req.query;
    
    if (!dni) {
      return res.status(400).json({ error: 'DNI requerido' });
    }

    const patient = await searchPatientByDni(dni);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(patient);
  } catch (err) {
    console.error('[ERROR] Buscar paciente:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/patients/:patientId/appointments
 * Obtener citas de un paciente
 */
app.get('/api/patients/:patientId/appointments', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await getPatientAppointments(patientId);
    res.json(appointments);
  } catch (err) {
    console.error('[ERROR] Obtener citas del paciente:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ============ ENDPOINTS DE PACIENTES ============

/**
 * POST /api/patients
 * Crear un nuevo paciente
 */
app.post('/api/patients', authenticate, async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    console.error('[ERROR] Crear paciente:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/patients
 * Obtener todos los pacientes
 */
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await getPatients();
    res.json(patients);
  } catch (err) {
    console.error('[ERROR] Obtener pacientes:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/patients/:id
 * Obtener un paciente por ID
 */
app.get('/api/patients/:id', authenticate, async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(patient);
  } catch (err) {
    console.error('[ERROR] Obtener paciente por ID:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /api/patients/:id
 * Actualizar un paciente por ID
 */
app.put('/api/patients/:id', authenticate, async (req, res) => {
  try {
    const patient = await updatePatient(req.params.id, req.body);
    res.json(patient);
  } catch (err) {
    console.error('[ERROR] Actualizar paciente:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /api/patients/:id
 * Eliminar un paciente por ID
 */
app.delete('/api/patients/:id', authenticate, async (req, res) => {
  try {
    await deletePatient(req.params.id);
    res.status(204).send(); // No content
  } catch (err) {
    console.error('[ERROR] Eliminar paciente:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ============ ENDPOINTS DE HISTORIA CLÍNICA & EVOLUCIONES ============

/**
 * POST /api/evolutions
 * Registrar evolución de una cita
 */
app.post('/api/evolutions', authenticate, async (req, res) => {
  try {
    const { appointmentId, notes } = req.body;
    const professionalId = req.user.id;

    const evolution = await createEvolution(appointmentId, professionalId, notes);
    res.status(201).json(evolution);
  } catch (err) {
    console.error('[ERROR] Crear evolución:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/patients/:patientId/evolutions
 * Obtener evoluciones (historia clínica) de un paciente
 */
app.get('/api/patients/:patientId/evolutions', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const evolutions = await getPatientEvolutions(patientId);
    res.json(evolutions);
  } catch (err) {
    console.error('[ERROR] Obtener evoluciones:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/patients/:patientId/medical-history
 * Obtener historial médico completo
 */
app.get('/api/patients/:patientId/medical-history', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const history = await getPatientMedicalHistory(patientId);
    res.json(history);
  } catch (err) {
    console.error('[ERROR] Obtener historia médica:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/patients/:patientId/diagnosis
 * Agregar nuevo diagnóstico a historia clínica
 */
app.post('/api/patients/:patientId/diagnosis', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'description es requerida' });
    }

    const diagnosis = await addDiagnosis(patientId, description);
    res.status(201).json(diagnosis);
  } catch (err) {
    console.error('[ERROR] Agregar diagnóstico:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ============ ENDPOINTS DE CAJA CHICA ============

/**
 * POST /api/cashflow
 * Registrar ingreso/egreso
 * Nota: en desarrollo permitimos acceso sin token para facilitar pruebas locales
 */
app.post('/api/cashflow', async (req, res) => {
  try {
    console.log('[INFO] POST /api/cashflow - Body:', req.body);
    
    const { type, amount, concept, method, notes, category, receipt } = req.body;
    
    // Validar campos requeridos
    if (!type || !amount || !concept || !method) {
      console.warn('[WARN] Campos faltantes:', { type, amount, concept, method });
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes: type, amount, concept, method' 
      });
    }

    // profesional opcional en dev; si existe user, lo usamos
    const professionalId = req.user?.id || null;

    console.log('[INFO] Creando cashflow con:', { type, amount, concept, method, category, receipt, date: req.body.date });

    const flow = await createCashFlow(
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

    console.log('[INFO] CashFlow creado exitosamente:', flow.id);
    res.status(201).json(flow);
  } catch (err) {
    console.error('[ERROR] Crear flujo caja:', err && err.stack ? err.stack : err);
    res.status(500).json({ 
      error: err.message || 'Error al registrar flujo de caja',
      details: process.env.NODE_ENV === 'development' ? (err && err.stack ? err.stack : err.toString()) : undefined
    });
  }
});

/**
 * GET /api/cashflow/balance
 * Obtener balance de caja en rango de fechas
 */
app.get('/api/cashflow/balance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Parámetros requeridos: startDate, endDate' 
      });
    }

    const balance = await getCashBalance(startDate, endDate);
    res.json(balance);
  } catch (err) {
    console.error('[ERROR] Obtener balance:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/cashflow
 * Obtener flujos de caja con filtros
 */
app.get('/api/cashflow', async (req, res) => {
  try {
    const { startDate, endDate, type, method, limit } = req.query;

    const filters = {};
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    if (type) filters.type = type;
    if (method) filters.method = method;
    if (limit) filters.limit = parseInt(limit, 10);

    const flows = await getCashFlows(filters);
    res.json(flows);
  } catch (err) {
    console.error('[ERROR] Obtener flujos:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ============ ERROR HANDLER ============

app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============ ENDPOINTS DE PROFESIONALES ============

/**
 * GET /api/professionals
 * Obtener lista de profesionales
 */
app.get('/api/professionals', authenticate, async (req, res) => {
  try {
    const prisma = require('./prismaClient');
    const professionals = await prisma.professional.findMany({
      orderBy: { firstName: 'asc' }
    });
    res.json(professionals);
  } catch (err) {
    console.error('[ERROR] Obtener profesionales:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ============ INICIAR SERVIDOR ============

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ KAREH Backend iniciado en puerto ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔐 JWT configurado: ${process.env.JWT_SECRET ? 'SÍ' : 'NO (DEV)'}`);
  console.log(`🗄️  DB: PostgreSQL`);
});

