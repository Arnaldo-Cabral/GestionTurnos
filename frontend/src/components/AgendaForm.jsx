import React, { useState } from 'react';
import axios from 'axios';

const AgendaForm = () => {
  const [diaSemana, setDiaSemana] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');

  // ⚠️ IMPORTANTE: el token del profesional debe estar guardado en localStorage al hacer login
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3001/api/agenda',
        {
          dia_semana: diaSemana,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje(`Agenda creada: ${response.data.dia_semana} de ${response.data.hora_inicio} a ${response.data.hora_fin}`);
      setDiaSemana('');
      setHoraInicio('');
      setHoraFin('');
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al crear la agenda');
    }
  };

  return (
    <div>
      <h2>Cargar Agenda Profesional</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Día de la semana:</label>
          <select value={diaSemana} onChange={(e) => setDiaSemana(e.target.value)} required>
            <option value="">Seleccione...</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
          </select>
        </div>

        <div>
          <label>Hora inicio:</label>
          <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
        </div>

        <div>
          <label>Hora fin:</label>
          <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} required />
        </div>

        <button type="submit">Guardar Agenda</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AgendaForm;