// src/utils/formatFecha.js

//****PAra arreglar la fecha de la base de datos porque se muetra mal */

export const formatFechaHoraLocal = (fechaUTC) => {
  if (!fechaUTC) return '';

  const fecha = new Date(fechaUTC);

  return fecha.toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatHoraLocal = (fechaUTC) => {
  if (!fechaUTC) return '';

  const fecha = new Date(fechaUTC);

  return fecha.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatSoloFecha = (fechaUTC) => {
  if (!fechaUTC) return '';

  const fecha = new Date(fechaUTC);

  return fecha.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};