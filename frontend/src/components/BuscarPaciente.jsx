/* import { useState } from 'react';
import { buscarPacientePorDNI } from '../services/pacienteService';

const BuscarPaciente = ({ onSelect }) => {
    const [dni, setDni] = useState('');
    const [paciente, setPaciente] = useState(null);

    const handleBuscar = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await buscarPacientePorDNI(dni, token);
            setPaciente(res.data);
            onSelect(res.data); // pasa el paciente al padre

            console.log('Paciente recibido:', res.data);//bucscar en el log

        } catch {
            setPaciente(null);
        }
    };

    return (
        <div>
            <input value={dni} onChange={e => setDni(e.target.value)} placeholder="DNI del paciente" />
            <button onClick={handleBuscar}>Buscar</button>
            {paciente && (
                <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px', borderRadius: '5px' }}>
                    <p><strong>Nombre:</strong> {paciente.nombre}</p>
                    <p><strong>DNI:</strong> {paciente.dni}</p>
                    <p><strong>Teléfono:</strong> {paciente.telefono}</p>
                </div>
            )}

        </div>
    );
};

export default BuscarPaciente; */

import { useState } from 'react';
import axios from 'axios';

const BuscarPaciente = () => {
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
      setError(''); // limpio error si encuentro paciente
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
        placeholder="Ingrese DNI"
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