import { useState, useEffect } from 'react';
import { buscarProfesionalesPorEspecialidad, obtenerEspecialidades } from '../services/profesionalService';

const SeleccionarEspecialidad = ({ onSelectProfesional }) => {
  const [especialidad, setEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    obtenerEspecialidades(token)
      .then(res => setEspecialidades(res.data))
      .catch(err => console.error('Error al obtener especialidades:', err));
  }, []);

  useEffect(() => {
    if (especialidad) {
      buscarProfesionalesPorEspecialidad(especialidad, token)
        .then(res => setProfesionales(res.data))
        .catch(err => console.error('Error al buscar profesionales:', err));
    }
  }, [especialidad]);

  return (
    <div>
      <h4>Seleccionar especialidad</h4>
      <select value={especialidad} onChange={e => setEspecialidad(e.target.value)}>
        <option value="">-- Seleccione --</option>
        {especialidades.map((esp, i) => (
          <option key={i} value={esp.especialidad}>{esp.especialidad}</option>
        ))}
      </select>

      {profesionales.length > 0 && (
        <div>
          <h4>Profesionales disponibles</h4>
          <ul>
            {profesionales.map(p => (
              <li key={p.id}>
                {p.Usuario?.nombre} ({p.especialidad})
                <button onClick={() => onSelectProfesional(p)}>Seleccionar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SeleccionarEspecialidad;