// 1. Cambiamos la URL base para que apunte al puerto del Backend (4000)
const API_BASE_URL = 'http://localhost:4000/api';

async function callApi(endpoint, method = 'GET', data = null, authRequired = true) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Buscamos el token (usando 'authToken' para ser consistente con tu otro servicio)
  const AUTH_TOKEN = localStorage.getItem('authToken') || sessionStorage.getItem('authToken'); 

  if (authRequired && AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  // Ahora la URL será http://localhost:4000/api/patients...
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    // Si el servidor devuelve HTML en lugar de JSON (error 404), esto evita el error de "Unexpected token <"
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    } else {
      throw new Error(`Error del servidor: ${response.status}`);
    }
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// --- FUNCIONES EXPORTADAS ---

export async function getPatients() {
  return callApi('/patients');
}

export async function getPatientById(id) {
  return callApi(`/patients/${id}`);
}

export async function addPatient(patientData) {
  return callApi('/patients', 'POST', patientData);
}

export async function updatePatient(id, patientData) {
  return callApi(`/patients/${id}`, 'PUT', patientData);
}

export async function deletePatient(id) {
  return callApi(`/patients/${id}`, 'DELETE');
}

export async function searchPatients(query) {
  const allPatients = await getPatients();
  if (!Array.isArray(allPatients)) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return allPatients.filter(
    p => (p.name?.toLowerCase().includes(lowercaseQuery)) ||
         (p.email?.toLowerCase().includes(lowercaseQuery)) ||
         (p.phone && p.phone.includes(query)) 
  );
}

export async function getPatientsByStatus(status) {
  const allPatients = await getPatients();
  if (!Array.isArray(allPatients)) return [];
  return allPatients.filter(p => p.status === status);
}