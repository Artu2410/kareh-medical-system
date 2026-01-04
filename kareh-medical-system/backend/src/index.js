require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Routers
const appointmentsRouter = require('./routes/appointments.routes');
const patientsRouter = require('./routes/patients.routes');
const cashflowRouter = require('./routes/cashflow.routes');
const professionalsRouter = require('./routes/professionals.routes');
const evolutionsRouter = require('./routes/evolutions.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5173'],
  credentials: true
}));
app.use(bodyParser.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});


// Montar routers
app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/cashflow', cashflowRouter);
app.use('/api/professionals', professionalsRouter);
app.use('/api/evolutions', evolutionsRouter);
// ============ INICIAR SERVIDOR ============
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ KAREH Backend iniciado en puerto ${PORT}`);
}); 