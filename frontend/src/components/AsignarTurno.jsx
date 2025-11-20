import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BuscarPaciente from './BuscarPaciente';
import SeleccionarProfesional from './SeleccionarProfesional';
import { consultarDisponibilidad, crearTurno } from '../services/turnoService';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';

const AsignarTurno = () => {
  const { usuario } = useContext(AuthContext); // recepcionista logueado
  const [paciente, setPaciente] = useState(null);
  const [profesional, setProfesional] = useState(null);
  const [fecha, setFecha] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // Paso 1: seleccionar paciente
  const handlePacienteSeleccionado = (p) => {
    setPaciente(p);
    setProfesional(null);
    setFecha('');
    setHorarios([]);
  };

  // Paso 2: seleccionar profesional
  const handleProfesionalSeleccionado = (p) => {
    setProfesional(p);
    setFecha('');
    setHorarios([]);
  };

  // Paso 3: consultar disponibilidad
  const handleBuscarDisponibilidad = async () => {
    if (!profesional || !fecha) {
      setSnackbar({ open: true, message: "Selecciona profesional y fecha", severity: "warning" });
      return;
    }
    try {
      const res = await consultarDisponibilidad(profesional.id, fecha);
      console.log("📥 Disponibilidad recibida:", res.data);
      setHorarios(res.data.disponibles || []);
    } catch (error) {
      console.error("Error al consultar disponibilidad:", error);
      setSnackbar({ open: true, message: "Error al cargar disponibilidad", severity: 'error' });
    }
  };

  // Paso 4: crear turno
  const handleCrearTurno = async (horaSeleccionada) => {
    // Construir fecha completa con hora
    const fechaCompleta = `${fecha}T${horaSeleccionada}:00`; // ej: "2025-11-20T09:00:00"

    const turnoData = {
      paciente_id: paciente?.id,
      profesional_id: profesional?.id,
      recepcionista_id: usuario?.id,
      fecha: fechaCompleta
    };

    console.log("🚨 PAYLOAD ENVIADO AL BACKEND:", JSON.stringify(turnoData, null, 2));

    try {
      await crearTurno(turnoData);
      setSnackbar({ open: true, message: "✅ Turno creado correctamente", severity: 'success' });
      await handleBuscarDisponibilidad(); // refresca lista
    } catch (error) {
      console.error("❌ Error al crear turno:", error);
      const msgBackend = error.response?.data?.error || error.message;
      setSnackbar({ open: true, message: `Error al reservar: ${msgBackend}`, severity: 'error' });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Asignar Turno
      </Typography>

      {/* Paso 1: Buscar paciente */}
      {!paciente && <BuscarPaciente onSelect={handlePacienteSeleccionado} />}

      {/* Paso 2: Seleccionar profesional */}
      {paciente && !profesional && (
        <Box mt={2}>
          <Typography variant="subtitle1">
            <strong>Paciente:</strong> {paciente.nombre} (DNI: {paciente.dni})
          </Typography>
          <Divider sx={{ my: 1 }} />
          <SeleccionarProfesional onSelect={handleProfesionalSeleccionado} />
        </Box>
      )}

      {/* Paso 3 y 4: Seleccionar fecha y mostrar horarios */}
      {paciente && profesional && (
        <Box mt={2}>
          <Typography variant="subtitle1">
            <strong>Profesional:</strong> {profesional.Usuario?.nombre} ({profesional.especialidad})
          </Typography>

          <Box display="flex" alignItems="center" gap={2} my={2}>
            <TextField
              type="date"
              label="Fecha"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="contained" onClick={handleBuscarDisponibilidad} disabled={!fecha}>
              Ver Disponibilidad
            </Button>
          </Box>

          <Divider />

          <List sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
            {horarios.length === 0 ? (
              <ListItem>
                <ListItemText secondary="No hay horarios disponibles o no se ha seleccionado fecha." />
              </ListItem>
            ) : (
              horarios.map((h, i) => (
                <div key={i}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleCrearTurno(h.hora)} // 👈 ahora pasamos solo la hora
                      >
                        Reservar
                      </Button>
                    }
                  >
                    <ListItemText primary={`${h.hora} hs`} secondary={h.dia} />
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))
            )}
          </List>
        </Box>
      )}

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AsignarTurno;