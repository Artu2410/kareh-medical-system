const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

function getHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

async function handleResponse(response) {
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
  }
  return data;
}

// --- FUNCIONES DE CITAS ---

export async function addAppointment(appointmentData) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(appointmentData)
  });
  return handleResponse(response);
}

export const createAppointment = addAppointment;

export async function getAppointments() {
  const response = await fetch(`${API_URL}/appointments`, { headers: getHeaders() });
  return handleResponse(response);
}

export async function getAppointmentsByDate(date) {
  // Aseguramos que la fecha sea un string plano YYYY-MM-DD
  const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
  const response = await fetch(`${API_URL}/appointments?date=${dateStr}`, { headers: getHeaders() });
  return handleResponse(response);
}

export async function getAppointmentsByDoctor(doctorId) {
  const response = await fetch(`${API_URL}/appointments?doctorId=${doctorId}`, { headers: getHeaders() });
  return handleResponse(response);
}

export async function updateAppointment(appointmentId, data) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteAppointment(appointmentId) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response);
}

// --- DISPONIBILIDAD Y BÚSQUEDA ---

export async function getAvailability(professionalId, startDate, endDate) {
  const params = new URLSearchParams({
    professionalId,
    startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
    endDate: endDate instanceof Date ? endDate.toISOString() : endDate
  });
  const response = await fetch(`${API_URL}/availability?${params}`, { headers: getHeaders() });
  return handleResponse(response);
}

export async function getAppointmentSlots(doctorId, date) {
  const response = await fetch(
    `${API_URL}/availability?professionalId=${doctorId}&startDate=${date}&endDate=${date}`,
    { headers: getHeaders() }
  );
  return handleResponse(response);
}

export async function searchPatientByDni(dni) {
  const response = await fetch(`${API_URL}/patients/search?dni=${encodeURIComponent(dni)}`, { headers: getHeaders() });
  if (response.status === 404) return null;
  return handleResponse(response);
}

// --- HISTORIA CLÍNICA ---

export async function getPatientAppointments(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}/appointments`, { headers: getHeaders() });
  return handleResponse(response);
}

export async function createEvolution(appointmentId, notes) {
  const response = await fetch(`${API_URL}/evolutions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ appointmentId, notes })
  });
  return handleResponse(response);
}

export async function addDiagnosis(patientId, description) {
  const response = await fetch(`${API_URL}/patients/${patientId}/diagnosis`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ description })
  });
  return handleResponse(response);
}