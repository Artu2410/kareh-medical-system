import { useToast } from '@/components/ui';
const API_URL = '/api';

/**
 * Obtener token del localStorage o sessionStorage
 */
function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * Headers para peticiones autenticadas
 */
function getHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Función auxiliar para formatear fechas de forma segura.
 * Si recibe un string lo deja igual, si recibe un objeto Date lo convierte.
 */
const formatDateParam = (date) => {
  if (!date) return null;
  if (typeof date === 'string') return date;
  if (date instanceof Date) return date.toISOString();
  return date;
};

/**
 * Registrar ingreso/egreso en caja chica
 */
export async function createCashFlow(type, amount, concept, method, notes = null, category = 'OTHER', receipt = null, date = null, patientId = null) {
  const toast = useToast && useToast();
  try {
    const url = `${API_URL}/cashflow`;
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        type,
        amount: parseFloat(amount),
        concept,
        method,
        notes,
        category,
        receipt,
        date,
        patientId,
      })
    });
    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = 'Error al registrar flujo de caja';
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.error || errorMessage;
      } catch (e) {
        errorMessage = `Error ${response.status}: ${responseText}`;
      }
      if (response.status === 400 || response.status === 401) {
        toast && toast(errorMessage, 'error');
      }
      throw new Error(errorMessage);
    }
    return JSON.parse(responseText);
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      toast && toast('No se puede conectar con el servidor. Verifica que el backend esté corriendo.', 'error');
      throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo.');
    }
    toast && toast(err.message, 'error');
    throw err;
  }
}

/**
 * Obtener balance de caja (ingresos - egresos)
 */
export async function getCashBalance(startDate, endDate) {
  const params = new URLSearchParams({
    startDate: formatDateParam(startDate),
    endDate: formatDateParam(endDate)
  });

  const response = await fetch(`${API_URL}/cashflow/balance?${params}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener balance de caja');
  }

  return response.json();
}

/**
 * Obtener flujos de caja con filtros
 */
export async function getCashFlows(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', formatDateParam(filters.startDate));
  if (filters.endDate) params.append('endDate', formatDateParam(filters.endDate));
  if (filters.type) params.append('type', filters.type);
  if (filters.method) params.append('method', filters.method);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await fetch(`${API_URL}/cashflow?${params}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener flujos de caja');
  }

  return response.json();
}