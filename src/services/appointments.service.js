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
 * Crear turno(s) - máximo 5 por slot, soporte paquetes 10
 */
export async function createAppointment(payload) {
  const toast = useToast && useToast();
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    let errorMessage = 'Error al crear turno';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {}
    if (response.status === 400 || response.status === 401) {
      toast && toast(errorMessage, 'error');
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Obtener disponibilidad de profesional
 */
export async function getAvailability(professionalId, startDate, endDate) {
  const params = new URLSearchParams({
    professionalId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });

  const response = await fetch(`${API_URL}/availability?${params}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener disponibilidad');
  }

  const data = await response.json();
  return data.availability;
}

/**
 * Buscar paciente por DNI
 */
export async function searchPatientByDni(dni) {
  const params = new URLSearchParams({ dni });

  const response = await fetch(`${API_URL}/patients/search?${params}`, {
    headers: getHeaders()
  });

  if (response.status === 404) {
    return null; // Paciente no encontrado
  }

  if (!response.ok) {
    throw new Error('Error al buscar paciente');
  }

  return response.json();
}

/**
 * Obtener citas de un paciente
 */
export async function getPatientAppointments(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}/appointments`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener citas del paciente');
  }

  return response.json();
}

/**
 * Obtener historial médico completo
 */
export async function getPatientMedicalHistory(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}/medical-history`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener historia médica');
  }

  return response.json();
}

/**
 * Registrar evolución de cita
 */
export async function createEvolution(appointmentId, notes) {
  const response = await fetch(`${API_URL}/evolutions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ appointmentId, notes })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al registrar evolución');
  }

  return response.json();
}

/**
 * Obtener evoluciones de paciente
 */
export async function getPatientEvolutions(patientId) {
  const response = await fetch(`${API_URL}/patients/${patientId}/evolutions`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error('Error al obtener evoluciones');
  }

  return response.json();
}

/**
 * Agregar diagnóstico a historia clínica
 */
export async function addDiagnosis(patientId, description) {
  const response = await fetch(`${API_URL}/patients/${patientId}/diagnosis`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ description })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al agregar diagnóstico');
  }

  return response.json();
}

/**
 * Obtener slots disponibles para una fecha y doctor
 */
export async function getAppointmentSlots(doctorId, date) {
  const response = await fetch(
    `${API_URL}/availability?professionalId=${doctorId}&startDate=${date}&endDate=${date}`,
    { headers: getHeaders() }
  );
  
  if (!response.ok) {
    throw new Error('Error al obtener slots');
  }
  
  return response.json();
}

/**
 * Obtener todos los turnos (para compatibilidad con componentes)
 */
export async function getAppointments() {
  // Retornar array vacío - la lista se obtiene por paciente
  return [];
}

/**
 * Obtener turnos por fecha (para compatibilidad)
 */
export async function getAppointmentsByDate(date) {
  const response = await fetch(`${API_URL}/appointments?date=${date}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener turnos');
  }
  
  return response.json();
}

/**
 * Obtener turnos por doctor (para compatibilidad)
 */
export async function getAppointmentsByDoctor(doctorId) {
  const response = await fetch(`${API_URL}/appointments?doctorId=${doctorId}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Error al obtener turnos');
  }
  
  return response.json();
}

/**
 * Actualizar turno (para compatibilidad)
 */
export async function updateAppointment(appointmentId, data) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Error al actualizar turno');
  }
  
  return response.json();
}

/**
 * Eliminar turno (para compatibilidad)
 */
export async function deleteAppointment(appointmentId) {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Error al eliminar turno');
  }
  
  return response.json();
}

/**
 * Obtener flujos de caja
 */
export async function getCashFlows(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(
    `${API_URL}/cashflow${queryString ? '?' + queryString : ''}`,
    { headers: getHeaders() }
  );
  
  if (!response.ok) {
    throw new Error('Error al obtener flujos de caja');
  }
  
  return response.json();
}

/**
 * Alias para compatibilidad con componentes existentes
 */
export const addAppointment = createAppointment;
