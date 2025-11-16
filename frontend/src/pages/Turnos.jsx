import { useState } from 'react';
import BuscarPaciente from '../components/BuscarPaciente';
import SeleccionarProfesional from '../components/SeleccionarProfesional';
import AsignarTurno from '../components/AsignarTurno';

const Turnos = () => {
  const [paciente, setPaciente] = useState(null);
  const [profesional, setProfesional] = useState(null);

  return (
    <div>
      <h2>Asignar Turno</h2>
      <BuscarPaciente onSelect={setPaciente} />
      <SeleccionarProfesional onSelect={setProfesional} />

      {paciente && profesional && (
        <AsignarTurno paciente={paciente} profesional={profesional} />
      )}
    </div>
  );
};

export default Turnos;