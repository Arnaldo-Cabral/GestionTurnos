import { useState, useEffect } from 'react';
import { obtenerEspecialidades, buscarProfesionalesPorEspecialidad } from '../services/profesionalService';

const SeleccionarProfesional = ({ onSelect }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState('');
  const [profesionales, setProfesionales] = useState([]);

  // Cargar especialidades al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    obtenerEspecialidades(token)
      .then(res => {
        console.log('Especialidades recibidas:', res.data);
        setEspecialidades(res.data);
      })
      .catch(err => console.error('Error al cargar especialidades', err));
  }, []);

  // Buscar profesionales por especialidad seleccionada
  const handleBuscar = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await buscarProfesionalesPorEspecialidad(especialidad, token);
      console.log('Profesionales recibidos:', res.data);
      setProfesionales(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al buscar profesionales', error);
      setProfesionales([]);
    }
  };

  return (
    <div>
      <label>Seleccionar especialidad:</label>
      <select value={especialidad} onChange={e => setEspecialidad(e.target.value)}>
        <option value="">-- Seleccionar --</option>
        {especialidades.map((esp, i) => (
          <option key={i} value={esp}>{esp}</option>
        ))}
      </select>

      <button onClick={handleBuscar} disabled={!especialidad}>
        Buscar profesionales
      </button>

      <ul>
        {Array.isArray(profesionales) && profesionales.map(p => (
          <li key={p.id} onClick={() => onSelect(p)}>
            {p.Usuario?.nombre || 'Sin nombre'} ({p.especialidad})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeleccionarProfesional;