const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Obtener token de autenticación
 */
function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * Headers con autenticación
 */
function getHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Manejo centralizado de respuestas y errores
 */
async function handleResponse(response) {
  if (response.status === 204) return null;
  
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
  }
  return data;
}

/**
 * GET /api/patients
 */
export async function getPatients() {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    headers: getHeaders()
  });
  return handleResponse(response);
}

/**
 * GET /api/patients/:id
 */
export async function getPatientById(id) {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    headers: getHeaders()
  });
  return handleResponse(response);
}

/**
 * POST /api/patients
 */
export async function addPatient(patientData) {
  console.log('🔄 Enviando datos del paciente:', patientData);
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(patientData)
  });
  return handleResponse(response);
}

/**
 * PUT /api/patients/:id
 */
export async function updatePatient(id, patientData) {
  console.log(`🔄 Actualizando paciente ${id}:`, patientData);
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(patientData)
  });
  return handleResponse(response);
}

/**
 * DELETE /api/patients/:id
 */
export async function deletePatient(id) {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response);
}

/**
 * GET /api/patients/search?dni=...
 */
export async function searchPatientByDni(dni) {
  const response = await fetch(`${API_BASE_URL}/patients/search?dni=${encodeURIComponent(dni)}`, {
    headers: getHeaders()
  });
  if (response.status === 404) return null;
  return handleResponse(response);
}

/**
 * Búsqueda local combinada
 */
export async function searchPatients(query) {
  const allPatients = await getPatients();
  const lowercaseQuery = query.toLowerCase();
  
  return allPatients.filter(p => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const dni = p.dni?.toString() || '';
    return fullName.includes(lowercaseQuery) || dni.includes(lowercaseQuery);
  });
}

/**
 * FUNCION REQUERIDA POR TU INDEX.JS
 * Filtrar por estado (Activo/Inactivo)
 */
export async function getPatientsByStatus(status) {
  try {
    const allPatients = await getPatients();
    return allPatients.filter(p => p.status === status);
  } catch (error) {
    console.error(`Error al filtrar pacientes por estado ${status}:`, error);
    throw error;
  }
}

/**
 * Validaciones básicas
 */
export function validatePatientData(data) {
  const errors = {};
  if (!data.firstName?.trim()) errors.firstName = 'El nombre es requerido';
  if (!data.lastName?.trim()) errors.lastName = 'El apellido es requerido';
  if (!data.dni?.trim()) errors.dni = 'El DNI es requerido';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}