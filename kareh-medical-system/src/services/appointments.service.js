const API_URL = 'http://localhost:4000/api';

function getHeaders() {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// --- 1. FUNCIONES REALES (Lógica de Negocio) ---

export async function createAppointment(payload) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Error al crear turno');
  return response.json();
}

export async function createAppointmentPackage(wizardData) {
  const payload = {
    patient: wizardData.patient,
    professionalId: wizardData.docId,
    appointmentType: 'package',
    therapyType: 'FKT',
    diagnosis: wizardData.diagnosis,
    dates: wizardData.previewDates.map(date => {
      const [hours, minutes] = wizardData.time.split(':');
      const finalDate = new Date(date);
      finalDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return finalDate.toISOString();
    })
  };
  return await createAppointment(payload);
}

export async function getAppointmentsByDate(date) {
  const response = await fetch(`${API_URL}/appointments?date=${date}`, {
    headers: getHeaders()
  });
  if (!response.ok) return [];
  return response.json();
}

// FUNCIÓN DE ELIMINAR ACTUALIZADA
export async function deleteAppointment(id) {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: 'DELETE',
    headers: getHeaders() // Añadimos los headers por seguridad/consistencia
  });
  if (!response.ok) throw new Error('No se pudo eliminar la cita');
  return await response.json();
}

export async function getAvailability(professionalId, startDate, endDate) {
  const params = new URLSearchParams({ professionalId, startDate, endDate });
  const response = await fetch(`${API_URL}/appointments/availability?${params}`, {
    headers: getHeaders()
  });
  if (!response.ok) return [];
  return response.json();
}

export async function searchPatientByDni(dni) {
  const response = await fetch(`${API_URL}/appointments/patient-search/${dni}`, {
    headers: getHeaders()
  });
  if (!response.ok) return null;
  return response.json();
}

// --- 2. ALIAS Y STUBS ---

export const addAppointment = createAppointment;

export async function getAppointmentSlots() { return []; }
export async function getAppointments() { return []; }
export async function getAppointmentsByDoctor() { return []; }
export async function updateAppointment() { return {}; }
export async function getPatientAppointments() { return []; }
export async function createEvolution() { return {}; }
export async function addDiagnosis() { return {}; }