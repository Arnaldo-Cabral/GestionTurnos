import { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import BuscarPaciente from './BuscarPaciente';
import SeleccionarProfesional from './SeleccionarProfesional';
import { consultarDisponibilidad, crearTurno } from '../services/turnoService';

// IMPORTANTE: Nuevos componentes de MUI y Dayjs
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import {
  Box, Typography, Button, List, ListItem,
  ListItemText, Divider, Paper, Snackbar, Alert
} from '@mui/material';

// Configuración de idioma para el calendario
dayjs.locale('es');

const AsignarTurno = () => {
  const { usuario } = useContext(AuthContext);
  const [paciente, setPaciente] = useState(null);
  const [profesional, setProfesional] = useState(null);
  const [fecha, setFecha] = useState(null); // Ahora es un objeto dayjs o null
  const [horarios, setHorarios] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [diasAtencionNumeros, setDiasAtencionNumeros] = useState([]);

  // Mapeo para convertir tus strings de BD a números de Dayjs
  const mapaDias = {
    'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 
    'Jueves': 4, 'Viernes': 5, 'Sábado': 6
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const resetForm = () => {
    setPaciente(null);
    setProfesional(null);
    setFecha(null);
    setHorarios([]);
    setDiasAtencionNumeros([]);
  };

  const handlePacienteSeleccionado = (p) => {
    setPaciente(p);
    setProfesional(null);
    setFecha(null);
    setHorarios([]);
  };

  const handleProfesionalSeleccionado = (p) => {
    setProfesional(p);
    setFecha(null);
    setHorarios([]);

    // Convertimos los días de string a números para el validador del calendario
    const diasValidos = p.Agendas?.map(a => mapaDias[a.dia_semana]) || [];
    setDiasAtencionNumeros(diasValidos);
  };

  // Función que deshabilita los días que NO atiende el profesional
  const shouldDisableDate = (date) => {
    const diaSemana = date.day();
    return !diasAtencionNumeros.includes(diaSemana);
  };

  const handleBuscarDisponibilidad = async () => {
    if (!profesional || !fecha) {
      setSnackbar({ open: true, message: "Selecciona profesional y fecha", severity: "warning" });
      return;
    }
    try {
      const fechaFormateada = fecha.format('YYYY-MM-DD');
      const res = await consultarDisponibilidad(profesional.id, fechaFormateada);
      setHorarios(res.data.disponibles || []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar disponibilidad", severity: 'error' });
    }
  };

  const handleCrearTurno = async (horaSeleccionada) => {
    const fechaCompleta = `${fecha.format('YYYY-MM-DD')}T${horaSeleccionada}:00`;
    const turnoData = {
      paciente_id: paciente?.id,
      profesional_id: profesional?.id,
      recepcionista_id: usuario?.id,
      fecha: fechaCompleta
    };

    try {
      await crearTurno(turnoData);
      setSnackbar({ open: true, message: "✅ Turno creado correctamente", severity: 'success' });
      setTimeout(() => resetForm(), 1500);
    } catch (error) {
      const msgBackend = error.response?.data?.error || "Error al reservar";
      setSnackbar({ open: true, message: msgBackend, severity: 'error' });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" color="primary">Asignar Turno</Typography>
        {(paciente || profesional) && (
          <Button size="small" onClick={resetForm} color="inherit">Reiniciar</Button>
        )}
      </Box>

      {!paciente && <BuscarPaciente onSelect={handlePacienteSeleccionado} />}

      {paciente && !profesional && (
        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
            <strong>Paciente:</strong> {paciente.nombre}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <SeleccionarProfesional onSelect={handleProfesionalSeleccionado} />
        </Box>
      )}

      {paciente && profesional && (
        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1, mb: 2 }}>
            <strong>Profesional:</strong> {profesional.Usuario?.nombre} ({profesional.especialidad})
          </Typography>

          <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
            {/* CONFIGURACIÓN DEL DATEPICKER */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha del Turno"
                value={fecha}
                onChange={(newValue) => setFecha(newValue)}
                shouldDisableDate={shouldDisableDate}
                minDate={dayjs()} // Bloquea fechas pasadas
                slotProps={{
                  textField: { 
                    size: 'small', 
                    fullWidth: true,
                    helperText: "Días activos: según agenda del médico"
                  }
                }}
              />
            </LocalizationProvider>

            <Button 
              variant="contained" 
              onClick={handleBuscarDisponibilidad} 
              disabled={!fecha}
              sx={{ 
                height: '40px', // Altura fija igual al DatePicker
                whiteSpace: 'nowrap',
                px: 3,
                textTransform: 'none'
              }}
            >
              Ver Horarios
            </Button>
          </Box>

          <Divider />

          <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto', bgcolor: '#fafafa' }}>
            {horarios.length === 0 ? (
              <ListItem><ListItemText secondary="No hay horarios disponibles para el día seleccionado." /></ListItem>
            ) : (
              horarios.map((h, i) => (
                <Box key={i}>
                  <ListItem
                    secondaryAction={
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        onClick={() => handleCrearTurno(h.hora)}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                      >
                        Reservar
                      </Button>
                    }
                  >
                    <ListItemText primary={`${h.hora} hs`} />
                  </ListItem>
                  <Divider />
                </Box>
              ))
            )}
          </List>
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AsignarTurno;

/* import { useState, useContext, useMemo } from 'react'; // Agregamos useMemo
import { AuthContext } from '../context/AuthContext';
import BuscarPaciente from './BuscarPaciente';
import SeleccionarProfesional from './SeleccionarProfesional';
import { consultarDisponibilidad, crearTurno } from '../services/turnoService';
import {
  Box, Typography, Button, TextField, List, ListItem,
  ListItemText, Divider, Paper, Snackbar, Alert
} from '@mui/material';

const AsignarTurno = () => {
  const { usuario } = useContext(AuthContext);
  const [paciente, setPaciente] = useState(null);
  const [profesional, setProfesional] = useState(null);
  const [fecha, setFecha] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [diasAtencion, setDiasAtencion] = useState([]); // Nuevo estado para saber qué días atiende

  // 1. Cálculo de fecha de hoy corregido (Local Time)
  const hoy = useMemo(() => {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }, []);

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // Función para resetear todo el formulario (útil para el botón cancelar o tras éxito)
  const resetForm = () => {
    setPaciente(null);
    setProfesional(null);
    setFecha('');
    setHorarios([]);
  };

  const handlePacienteSeleccionado = (p) => {
    setPaciente(p);
    setProfesional(null);
    setFecha('');
    setHorarios([]);
  };

  const handleProfesionalSeleccionado = (p) => {
    setProfesional(p);
    setFecha('');
    setHorarios([]);

    // Extraemos los días de la agenda del profesional (ej: ['Lunes', 'Miércoles'])
    // Esto asume que el objeto profesional trae su relación con 'Agendas'
    const dias = p.Agendas?.map(a => a.dia_semana) || [];
    setDiasAtencion(dias);
  };

  const handleBuscarDisponibilidad = async () => {
    if (!profesional || !fecha) {
      setSnackbar({ open: true, message: "Selecciona profesional y fecha", severity: "warning" });
      return;
    }
    try {
      const res = await consultarDisponibilidad(profesional.id, fecha);
      setHorarios(res.data.disponibles || []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar disponibilidad", severity: 'error' });
    }
  };

  const handleCrearTurno = async (horaSeleccionada) => {
    const fechaCompleta = `${fecha}T${horaSeleccionada}:00`;
    const turnoData = {
      paciente_id: paciente?.id,
      profesional_id: profesional?.id,
      recepcionista_id: usuario?.id,
      fecha: fechaCompleta
    };

    try {
      await crearTurno(turnoData);
      setSnackbar({ open: true, message: "✅ Turno creado correctamente", severity: 'success' });

      // Limpiamos después de un breve delay para que vean el snackbar o usamos el reset
      setTimeout(() => {
        resetForm();
      }, 1500);

    } catch (error) {
      const msgBackend = error.response?.data?.error || "Error al reservar";
      setSnackbar({ open: true, message: msgBackend, severity: 'error' });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" color="primary">Asignar Turno</Typography>
        {(paciente || profesional) && (
          <Button size="small" onClick={resetForm} color="inherit">Reiniciar Busqueda</Button>
        )}
      </Box>

      {!paciente && <BuscarPaciente onSelect={handlePacienteSeleccionado} />}

      {paciente && !profesional && (
        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
            <strong>Paciente:</strong> {paciente.nombre} (DNI: {paciente.dni})
          </Typography>
          {/* NUEVO: Aviso de días de atención para guiar al recepcionista *
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 1 }}>
            Atiende los días: <strong>{diasAtencion.join(', ') || 'No definidos'}</strong>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <SeleccionarProfesional onSelect={handleProfesionalSeleccionado} />
        </Box>
      )}

      {paciente && profesional && (
        <Box mt={2}>
          <Typography variant="subtitle1" sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 1 }}>
            <strong>Profesional:</strong> {profesional.Usuario?.nombre} ({profesional.especialidad})
          </Typography>

          <Box display="flex" alignItems="center" gap={2} my={2}>
            <TextField
              type="date"
              label="Fecha del Turno"
              value={fecha}
              inputProps={{ min: hoy }}
              onChange={e => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <Button variant="contained"
              onClick={handleBuscarDisponibilidad}
              disabled={!fecha}
              sx={{
                whiteSpace: 'nowrap', // 👈 Evita que el texto se rompa o desfase
                minWidth: 'fit-content', // 👈 Asegura que el botón se ajuste al texto
                px: 3 // 👈 Padding horizontal extra
              }}
            >
              Ver Horarios
            </Button>
          </Box>

          <Divider />

          <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto', bgcolor: '#fafafa' }}>
            {horarios.length === 0 ? (
              <ListItem>
                <ListItemText
                  secondary="Seleccione una fecha para ver horarios disponibles."
                  textAlign="center"
                />
              </ListItem>
            ) : (
              horarios.map((h, i) => (
                <Box key={i}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleCrearTurno(h.hora)}
                        sx={{
                          fontWeight: 'bold',
                          textTransform: 'none', // 👈 Hace que no sea todo mayúsculas, ocupando menos espacio
                          px: 2
                        }}
                      >
                        Reservar
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`${h.hora} hs`}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))
            )}
          </List>
        </Box>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AsignarTurno; */

