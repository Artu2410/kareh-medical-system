import axios from 'axios';

const API = '/api/doctors';

export async function getDoctors() {
  const res = await axios.get(API);
  return res.data;
}
// Puedes agregar más funciones según endpoints disponibles
