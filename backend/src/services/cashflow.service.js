const prisma = require('../prismaClient');

/**
 * Crear un flujo de caja (ingreso/egreso)
 */
async function createCashFlow(type, amount, concept, method, professionalId = null, notes = null, category = 'OTHER', receipt = null, createdAt = null) {
  if (!['INCOME', 'EXPENSE'].includes(type)) {
    throw new Error('type debe ser INCOME o EXPENSE');
  }

  // Convertimos a número por si llega como string desde el body
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('amount debe ser un número mayor a 0');
  }

  const validCategories = ['SALARY', 'CONSULTATION', 'SUPPLIES', 'UTILITIES', 'RENT', 'STAFF', 'OTHER'];
  if (!validCategories.includes(category)) {
    category = 'OTHER';
  }

  const data = {
    type,
    amount: numAmount,
    concept: concept ? concept.trim() : '',
    category,
    method,
    receipt: receipt ? receipt.trim() : null,
    professionalId: professionalId || null,
    notes: notes ? notes.trim() : null
  };

  // Si envían createdAt (fecha seleccionada en el formulario), respetarla.
  // Cuando el frontend manda solo 'YYYY-MM-DD' se interpreta como UTC midnight
  // por JS, lo que puede mostrar el día anterior en zonas horarias negativas.
  // Para evitarlo, si recibimos formato solo fecha, construimos una fecha local a mediodía.
  if (createdAt) {
    let parsedDate = null;
    const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(createdAt);
    if (dateOnlyMatch) {
      const [y, m, d] = createdAt.split('-').map(Number);
      parsedDate = new Date(y, m - 1, d, 12, 0, 0, 0); // mediodía local
    } else {
      const tmp = new Date(createdAt);
      if (!isNaN(tmp.getTime())) parsedDate = tmp;
    }

    if (parsedDate) {
      data.createdAt = parsedDate;
    }
  }

  const flow = await prisma.cashFlow.create({
    data,
    include: { professional: true }
  });

  return flow;
}

/**
 * Obtener balance consolidado con ajuste de tiempo absoluto
 */
async function getCashBalance(startDate, endDate) {
  // Reutilizamos la lógica de getCashFlows para no repetir el código de fechas
  const flows = await getCashFlows({ startDate, endDate });

  const income = flows.filter(f => f.type === 'INCOME').reduce((s, f) => s + f.amount, 0);
  const expense = flows.filter(f => f.type === 'EXPENSE').reduce((s, f) => s + f.amount, 0);

  return {
    period: { startDate, endDate },
    income,
    expense,
    balance: income - expense,
    flows
  };
}

/**
 * Obtener flujos con filtros y CORRECCIÓN DE RANGO HORARIO
 */
async function getCashFlows(filters = {}) {
  const { startDate, endDate, type, method, limit = 100 } = filters;
  const where = {};

  // Lógica crítica: Ajuste de horas para que aparezcan los registros del mismo día
  if (startDate || endDate) {
    where.createdAt = {};
    
      if (startDate) {
        let s;
        if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
          const [y, m, d] = startDate.split('-').map(Number);
          s = new Date(y, m - 1, d, 0, 0, 0, 0);
        } else {
          s = new Date(startDate);
          s.setHours(0, 0, 0, 0);
        }
        where.createdAt.gte = s;
      }

      if (endDate) {
        let e;
        if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
          const [y, m, d] = endDate.split('-').map(Number);
          e = new Date(y, m - 1, d, 23, 59, 59, 999);
        } else {
          e = new Date(endDate);
          e.setHours(23, 59, 59, 999);
        }
        where.createdAt.lte = e;
      }
  }

  if (type && ['INCOME', 'EXPENSE'].includes(type)) {
    where.type = type;
  }

  if (method) {
    where.method = method;
  }

  console.log("Filtro de búsqueda ejecutado:", JSON.stringify(where, null, 2));

  return await prisma.cashFlow.findMany({
    where,
    include: { professional: true },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit)
  });
}

module.exports = {
  createCashFlow,
  getCashBalance,
  getCashFlows
};