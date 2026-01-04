// src/services/evolutions.service.js
import axios from 'axios';

const API = '/api/evolutions';

export async function createEvolution(data) {
  const res = await axios.post(API, data);
  return res.data;
}


export async function getPatientEvolutions(patientId) {
  const res = await axios.get(`${API}/by-patient/${patientId}`);
  return res.data;
}

export async function updateEvolution(id, data) {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
}

export async function deleteEvolution(id) {
  await axios.delete(`${API}/${id}`);
}

// Puedes agregar más funciones según endpoints disponibles
