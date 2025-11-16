import { useState } from 'react';
import { consultarDisponibilidad, crearTurno } from '../services/turnoService';

const AsignarTurno = ({ paciente, profesional }) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ocupado, setOcupado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Verificar si el horario está ocupado
  const verificarHorario = async () => {
    const token = localStorage.getItem('token');
    const fechaCompleta = `${fecha}T${hora}:00`;

    try {
      const res = await consultarDisponibilidad(profesional.id, fecha, token);
      const horariosOcupados = res.data.map(t => new Date(t.fecha).toISOString());

      if (horariosOcupados.includes(new Date(fechaCompleta).toISOString())) {
        setOcupado(true);
      } else {
        setOcupado(false);
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al verificar disponibilidad');
    }
  };

  // Confirmar y crear el turno
  const confirmarTurno = async () => {
    const token = localStorage.getItem('token');
    const fechaCompleta = `${fecha}T${hora}:00`;

    const turnoData = {
      paciente_id: paciente.id,
      profesional_id: profesional.id,
      fecha: fechaCompleta
      // recepcionista_id se obtiene del token en el backend
    };

    try {
      await crearTurno(turnoData, token);
      setMensaje('✅ Turno creado correctamente');
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al crear turno');
    }
  };

  return (
    <div>
      <h4>Seleccionar fecha y hora</h4>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      <input type="time" value={hora} onChange={e => setHora(e.target.value)} />

      <button onClick={verificarHorario}>Verificar disponibilidad</button>

      {ocupado === true && <p style={{ color: 'red' }}>Horario ocupado</p>}
      {ocupado === false && (
        <button onClick={confirmarTurno}>Confirmar turno</button>
      )}

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AsignarTurno;