import { useState } from 'react';
import { buscarProfesionalesPorEspecialidad } from '../services/profesionalService';

const SeleccionarProfesional = ({ onSelect }) => {
  const [especialidad, setEspecialidad] = useState('');
  const [profesionales, setProfesionales] = useState([]);

  const handleBuscar = async () => {
    const token = localStorage.getItem('token');
    const res = await buscarProfesionalesPorEspecialidad(especialidad, token);
    setProfesionales(res.data);
  };

  return (
    <div>
      <select onChange={e => setEspecialidad(e.target.value)}>
        <option value="">Seleccionar especialidad</option>
        <option value="Cardiología">Cardiología</option>
        <option value="Pediatría">Pediatría</option>
        {/* Agregá más especialidades según tu BD */}
      </select>
      <button onClick={handleBuscar}>Buscar profesionales</button>

      <ul>
        {profesionales.map(p => (
          <li key={p.id} onClick={() => onSelect(p)}>
            {p.usuario.nombre} (ID: {p.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeleccionarProfesional;