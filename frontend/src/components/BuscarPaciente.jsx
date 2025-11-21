import { useState } from 'react';
import axios from 'axios';

const BuscarPaciente = ({ onSelect }) => {   // 👈 ahora recibe onSelect
  const [dni, setDni] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState('');

  const handleBuscar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/pacientes/buscar?dni=${dni}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaciente(res.data);
      setError('');

      // 👇 avisamos al padre (AsignarTurno) que se seleccionó un paciente
      if (onSelect) {
        onSelect(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Paciente no encontrado');
        setPaciente(null);
      } else {
        setError('Error al buscar paciente');
        setPaciente(null);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={dni}
        onChange={e => setDni(e.target.value)}
        placeholder="Ingrese DNI Paciente"
      />
      <button onClick={handleBuscar}>Buscar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {paciente && (
        <div>
          <p>Nombre: {paciente.nombre}</p>
          <p>DNI: {paciente.dni}</p>
          <p>Teléfono: {paciente.telefono}</p>
        </div>
      )}
    </div>
  );
};

export default BuscarPaciente;