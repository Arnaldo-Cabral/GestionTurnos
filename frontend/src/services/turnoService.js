import axios from 'axios';

export const consultarDisponibilidad = async (profesional_id, fecha, token) => {
  return axios.get(`/turnos/disponibilidad?profesional_id=${profesional_id}&fecha=${fecha}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const crearTurno = async (turnoData, token) => {
  return axios.post('/turnos', turnoData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};