import api from './api';

export const obtenerAgendaPorProfesional = (profesionalId, token) => {
  return api.get(`/agenda/profesional/${profesionalId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};