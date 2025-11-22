import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api'; // Cambiá el puerto si tu backend usa otro

export const obtenerEspecialidades = async (token) => {
  return axios.get(`${BASE_URL}/profesionales/especialidades`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const buscarProfesionalesPorEspecialidad = async (esp, token) => {
  return axios.get(`${BASE_URL}/profesionales/especialidad/${esp}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
