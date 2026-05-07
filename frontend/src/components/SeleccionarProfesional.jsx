import { useState, useEffect } from 'react';
import { obtenerEspecialidades, buscarProfesionalesPorEspecialidad } from '../services/profesionalService';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';

const SeleccionarProfesional = ({ onSelect }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState('');
  const [profesionales, setProfesionales] = useState([]);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);

  // 1. Cargar especialidades al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    obtenerEspecialidades(token)
      .then(res => setEspecialidades(res.data))
      .catch(err => console.error('Error al cargar especialidades', err));
  }, []);

  // 2. Función de búsqueda manual
  const handleBuscar = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await buscarProfesionalesPorEspecialidad(especialidad.trim(), token);
      setProfesionales(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al buscar profesionales', error);
      setProfesionales([]);
    }
  };

  // ========================================================
  // AQUÍ VA EL NUEVO BLOQUE (Justo antes del handleSelectProfesional)
  // ========================================================
  useEffect(() => {
    if (especialidad) {
      handleBuscar(); // Cada vez que cambie la especialidad en el Select, busca solo.
    } else {
      setProfesionales([]); // Si no hay nada seleccionado, limpia la lista.
    }
  }, [especialidad]);
  // ========================================================

  const handleSelectProfesional = (p) => {
    setProfesionalSeleccionado(p);
    onSelect(p);
  };

  /* const SeleccionarProfesional = ({ onSelect }) => {
    const [especialidades, setEspecialidades] = useState([]);
    const [especialidad, setEspecialidad] = useState('');
    const [profesionales, setProfesionales] = useState([]);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
  
    // Cargar especialidades al montar
    useEffect(() => {
      const token = localStorage.getItem('token');
      obtenerEspecialidades(token)
        .then(res => {
          console.log('Especialidades recibidas:', res.data);
          setEspecialidades(res.data);
        })
        .catch(err => console.error('Error al cargar especialidades', err));
    }, []);
  
    // Buscar profesionales por especialidad
    const handleBuscar = async () => {
      const token = localStorage.getItem('token');
      try {
        // Usamos trim() por si acaso hay espacios en la selección
        const res = await buscarProfesionalesPorEspecialidad(especialidad.trim(), token);
        console.log('Profesionales recibidos:', res.data);
        setProfesionales(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error al buscar profesionales', error);
        setProfesionales([]);
      }
    };
  
    const handleSelectProfesional = (p) => {
      setProfesionalSeleccionado(p);
      onSelect(p); // avisa al padre (AsignarTurno.jsx)
    };
   */
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Seleccionar especialidad:
      </Typography>
      <Select
        value={especialidad}
        onChange={e => setEspecialidad(e.target.value)}
        displayEmpty
        fullWidth
        size="small"
      >
        <MenuItem value="">-- Seleccionar --</MenuItem>
        {especialidades.map((esp, i) => (
          <MenuItem key={i} value={esp}>{esp}</MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleBuscar}
        disabled={!especialidad}
      >
        Buscar profesionales
      </Button>

      <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
        {profesionales.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay profesionales para esta especialidad.
          </Typography>
        ) : (
          profesionales.map((p) => (
            <div key={p.id}>
              <ListItemButton
                selected={p.id === profesionalSeleccionado?.id}
                onClick={() => handleSelectProfesional(p)}
              >
                <ListItemText
                  primary={p.Usuario?.nombre || 'Sin nombre'}
                  secondary={p.especialidad}
                />
              </ListItemButton>
              <Divider />
            </div>
          ))
        )}
      </List>
    </Box>
  );
};

export default SeleccionarProfesional;