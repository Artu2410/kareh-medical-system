const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper function for API calls
async function callApi(endpoint, method = 'GET', data = null, authRequired = true) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // TODO: Implement actual authentication token retrieval
  // For now, assuming token is stored in localStorage after login
  const AUTH_TOKEN = localStorage.getItem('token'); 

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }

  // Handle 204 No Content for DELETE requests
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

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

// TODO: Implement actual search and filter if needed on the frontend
// For now, search and filter will be done by getting all patients and filtering client-side
export async function searchPatients(query) {
  const allPatients = await getPatients();
  const lowercaseQuery = query.toLowerCase();
  return allPatients.filter(
    p => p.name.toLowerCase().includes(lowercaseQuery) ||
         p.email.toLowerCase().includes(lowercaseQuery) ||
         (p.phone && p.phone.includes(query)) 
  );
}

export async function getPatientsByStatus(status) {
  const allPatients = await getPatients();
  return allPatients.filter(p => p.status === status);
}
