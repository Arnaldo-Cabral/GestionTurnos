import axios from 'axios';

export const buscarProfesionalesPorEspecialidad = async (esp, token) => {
  return axios.get(`/profesionales/especialidad/${esp}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};