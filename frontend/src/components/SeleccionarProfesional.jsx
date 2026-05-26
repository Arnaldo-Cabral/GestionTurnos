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

// 1. Recibimos 'seleccionado' desde el padre para saber cuándo limpiar
const SeleccionarProfesional = ({ onSelect, seleccionado }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidad, setEspecialidad] = useState('');
  const [profesionales, setProfesionales] = useState([]);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);

  // 2. ESCUCHA CAMBIOS EXTERNOS: Si el padre pone el profesional en null, limpiamos todo aquí
  useEffect(() => {
    if (!seleccionado) {
      setEspecialidad('');          // Limpia el Select de especialidades
      setProfesionales([]);         // Limpia la lista de médicos
      setProfesionalSeleccionado(null); // Quita el resaltado azul
    } else {
      setProfesionalSeleccionado(seleccionado);
    }
  }, [seleccionado]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    obtenerEspecialidades(token)
      .then(res => {
        const ordenadas = Array.isArray(res.data)
          ? res.data.sort((a, b) => a.localeCompare(b))
          : [];
        setEspecialidades(ordenadas);
      })
      .catch(err => console.error('Error al cargar especialidades', err));
  }, []);

  const handleBuscar = async () => {
    const token = localStorage.getItem('token');
    if (!especialidad) return; // Seguridad extra
    try {
      const res = await buscarProfesionalesPorEspecialidad(especialidad.trim(), token);
      const data = Array.isArray(res.data) ? res.data : [];

      const ordenados = data.sort((a, b) =>
        (a.Usuario?.nombre || "").localeCompare(b.Usuario?.nombre || "")
      );

      setProfesionales(ordenados);
    } catch (error) {
      console.error('Error al buscar profesionales', error);
      setProfesionales([]);
    }
  };

  // Búsqueda automática al cambiar especialidad
  useEffect(() => {
    if (especialidad) {
      handleBuscar();
    } else {
      setProfesionales([]);
    }
  }, [especialidad]);

  const handleSelectProfesional = (p) => {
    setProfesionalSeleccionado(p);
    onSelect(p);
  };

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
            {especialidad ? "No hay profesionales para esta especialidad." : "Seleccione una especialidad para ver médicos."}
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

/* import { useState, useEffect } from 'react';
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
      .then(res => {
        // Ordenamos las especialidades alfabéticamente
        const ordenadas = Array.isArray(res.data)
          ? res.data.sort((a, b) => a.localeCompare(b))
          : [];
        setEspecialidades(ordenadas);
      })
      .catch(err => console.error('Error al cargar especialidades', err));
  }, []);
  
  // 2. Función de búsqueda manual
  const handleBuscar = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await buscarProfesionalesPorEspecialidad(especialidad.trim(), token);
      const data = Array.isArray(res.data) ? res.data : [];

      // Ordenamos por el nombre del usuario
      const ordenados = data.sort((a, b) =>
        (a.Usuario?.nombre || "").localeCompare(b.Usuario?.nombre || "")
      );

      setProfesionales(ordenados);
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

export default SeleccionarProfesional; */