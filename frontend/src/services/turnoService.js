/* import api from './api';

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

// Obtener todos los turnos
export const getAllTurnos = async () => {
  return api.get('/turnos');
};

// Eliminar un turno por ID
export const eliminarTurno = async (id) => {
  return api.delete(`/turnos/${id}`);
};  */

import api from './api';

// Consultar disponibilidad de un profesional en una fecha
export const consultarDisponibilidad = async (profesional_id, fecha) => {
  return api.get('/agenda/disponibilidad', {
    params: { profesional_id, fecha }
  });
};

// Crear un nuevo turno
export const crearTurno = async (turnoData) => {
  return api.post('/turnos', turnoData);
};

// Obtener todos los turnos
export const getAllTurnos = async () => {
  return api.get('/turnos');
};

// Eliminar un turno por ID
export const eliminarTurno = async (id) => {
  return api.delete(`/turnos/${id}`);
};

// ✅ NUEVO: Actualizar estado de un turno
export const actualizarEstadoTurno = async (id, estado) => {
  return api.put(`/turnos/${id}/estado`, { estado });
};