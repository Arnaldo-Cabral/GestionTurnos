import { useState } from 'react';
import SeleccionarEspecialidad from '../components/SeleccionarEspecialidad';
import AsignarTurno from '../components/AsignarTurno';
import { buscarPacientePorDNI } from '../services/pacienteService';

const RecepcionistaPage = () => {
  const [dni, setDni] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
  const token = localStorage.getItem('token');

  const buscarPaciente = async () => {
    try {
      const res = await buscarPacientePorDNI(dni, token);
      setPaciente(res.data);
    } catch (error) {
      alert('Paciente no encontrado');
    }
  };

  return (
    <div>
      <h2>Gestión de turnos</h2>

      {/* Buscar paciente */}
      <div>
        <input
          value={dni}
          onChange={e => setDni(e.target.value)}
          placeholder="Ingrese DNI"
        />
        <button onClick={buscarPaciente}>Buscar</button>
        {paciente && (
          <p>
            Paciente: {paciente.nombre} - DNI: {paciente.dni} - Teléfono: {paciente.telefono}
          </p>
        )}
      </div>

      {/* Seleccionar especialidad y profesional */}
      {paciente && !profesionalSeleccionado && (
        <SeleccionarEspecialidad onSelectProfesional={setProfesionalSeleccionado} />
      )}

      {/* Asignar turno */}
      {paciente && profesionalSeleccionado && (
        <AsignarTurno paciente={paciente} profesional={profesionalSeleccionado} />
      )}
    </div>
  );
};

export default RecepcionistaPage;