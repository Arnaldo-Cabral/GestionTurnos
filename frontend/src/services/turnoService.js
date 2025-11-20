import api from './api';

// Consultar disponibilidad de un profesional en una fecha
export const consultarDisponibilidad = async (profesional_id, fecha) => {
  return api.get('/agenda/disponibilidad', {   // 👈 corregido: antes estaba /turnos/disponibilidad
    params: { profesional_id, fecha }
  });
};

// Crear un nuevo turno
export const crearTurno = async (turnoData) => {
  return api.post('/turnos', turnoData);
};