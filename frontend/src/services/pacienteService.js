import axios from 'axios';

export const buscarPacientePorDNI = async (dni, token) => {
  return axios.get(`/api/pacientes/buscar?dni=${dni}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};