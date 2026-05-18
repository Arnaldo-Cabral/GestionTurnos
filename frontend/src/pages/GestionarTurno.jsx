import { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getAllTurnos, eliminarTurno, actualizarEstadoTurno } from '../services/turnoService';

const GestionarTurno = () => {
  const [turnos, setTurnos] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  // --- NUEVOS ESTADOS PARA FILTROS ---
  // Inicializamos con la fecha de hoy en formato YYYY-MM-DD
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [busquedaMedico, setBusquedaMedico] = useState('');

  // Cargar turnos cuando cambie la fecha
  useEffect(() => {
    cargarTurnos();
  }, [filtroFecha]); 

  const cargarTurnos = async () => {
    try {
      // Enviamos la fecha como parámetro a la API
      const res = await getAllTurnos(filtroFecha);
      // El backend ya debería devolver los turnos ordenados, pero aseguramos aquí también
      const ordenados = res.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setTurnos(ordenados);
    } catch (error) {
      console.error("❌ Error al obtener turnos:", error);
      setSnackbar({ open: true, message: "Error al cargar turnos", severity: 'error' });
    }
  };

  // --- LÓGICA DE FILTRADO TIPO EXCEL (Frontend) ---
  const turnosFiltrados = turnos.filter(turno => {
    const cumplePaciente = (turno.Paciente?.nombre || "").toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
                          (turno.Paciente?.dni || "").includes(busquedaPaciente);
    const cumpleMedico = (turno.Profesional?.Usuario?.nombre || "").toLowerCase().includes(busquedaMedico.toLowerCase());
    
    return cumplePaciente && cumpleMedico;
  });

  const handleEliminarClick = (turno) => {
    setTurnoSeleccionado(turno);
    setDialogOpen(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarTurno(turnoSeleccionado.id);
      setSnackbar({ open: true, message: "✅ Turno eliminado correctamente", severity: 'success' });
      setDialogOpen(false);
      setTurnoSeleccionado(null);
      cargarTurnos();
    } catch (error) {
      console.error("❌ Error al eliminar turno:", error);
      setSnackbar({ open: true, message: "Error al eliminar turno", severity: 'error' });
    }
  };

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      await actualizarEstadoTurno(turnoId, nuevoEstado);
      setSnackbar({ open: true, message: "✅ Estado actualizado", severity: 'success' });
      cargarTurnos();
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
      setSnackbar({ open: true, message: "Error al actualizar estado", severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1100, mx: 'auto', my: 4, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
          Gestión de Agenda Diaria
        </Typography>
        
        {/* FILTRO DE FECHA (Backend) */}
        <TextField
          label="Fecha de Agenda"
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Hora</strong></TableCell>
              
              {/* FILTRO COLUMNA PACIENTE */}
              <TableCell>
                <strong>Paciente</strong>
                <TextField
                  placeholder="Buscar por DNI o Nombre..."
                  variant="standard"
                  size="small"
                  fullWidth
                  value={busquedaPaciente}
                  onChange={(e) => setBusquedaPaciente(e.target.value)}
                  InputProps={{ style: { fontSize: 13 } }}
                />
              </TableCell>

              {/* FILTRO COLUMNA PROFESIONAL */}
              <TableCell>
                <strong>Profesional</strong>
                <TextField
                  placeholder="Filtrar Médico..."
                  variant="standard"
                  size="small"
                  fullWidth
                  value={busquedaMedico}
                  onChange={(e) => setBusquedaMedico(e.target.value)}
                  InputProps={{ style: { fontSize: 13 } }}
                />
              </TableCell>

              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    No se encontraron turnos para los filtros seleccionados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              turnosFiltrados.map((turno) => (
                <TableRow key={turno.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {new Date(turno.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                  </TableCell>
                  <TableCell>
                    {turno.Paciente?.nombre} <br />
                    <Typography variant="caption" color="textSecondary">DNI: {turno.Paciente?.dni}</Typography>
                  </TableCell>
                  <TableCell>
                    {turno.Profesional?.Usuario?.nombre} <br />
                    <Typography variant="caption" sx={{ color: 'primary.main' }}>{turno.Profesional?.especialidad}</Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={turno.estado}
                      onChange={(e) => handleEstadoChange(turno.id, e.target.value)}
                      size="small"
                      sx={{ 
                        height: 30, 
                        fontSize: '0.8rem',
                        backgroundColor: turno.estado === 'PENDIENTE' ? '#fff9c4' : 
                                         turno.estado === 'REALIZADO' ? '#c8e6c9' : '#ffcdd2'
                      }}
                    >
                      <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                      <MenuItem value="REALIZADO">Realizado</MenuItem>
                      <MenuItem value="CANCELADO">Cancelado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleEliminarClick(turno)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog y Snackbar se mantienen igual... */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Seguro que deseas eliminar el turno del paciente <strong>{turnoSeleccionado?.Paciente?.nombre}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

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

export default GestionarTurno;

/* import { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllTurnos, eliminarTurno, actualizarEstadoTurno } from '../services/turnoService';

const GestionarTurno = () => {
  const [turnos, setTurnos] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

  // Cargar turnos al montar
  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      const res = await getAllTurnos();
      console.log("Turnos desde backend:", res.data);

      // Ordenar por fecha/hora en forma ascendente
      const ordenados = res.data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setTurnos(ordenados);
    } catch (error) {
      console.error("❌ Error al obtener turnos:", error);
      setSnackbar({ open: true, message: "Error al cargar turnos", severity: 'error' });
    }
  };

  const handleEliminarClick = (turno) => {
    setTurnoSeleccionado(turno);
    setDialogOpen(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarTurno(turnoSeleccionado.id);
      setSnackbar({ open: true, message: "✅ Turno eliminado correctamente", severity: 'success' });
      setDialogOpen(false);
      setTurnoSeleccionado(null);
      cargarTurnos(); // refrescar lista
    } catch (error) {
      console.error("❌ Error al eliminar turno:", error);
      setSnackbar({ open: true, message: "Error al eliminar turno", severity: 'error' });
    }
  };

  const handleEstadoChange = async (turnoId, nuevoEstado) => {
    try {
      await actualizarEstadoTurno(turnoId, nuevoEstado);
      setSnackbar({ open: true, message: "✅ Estado actualizado", severity: 'success' });
      cargarTurnos();
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
      setSnackbar({ open: true, message: "Error al actualizar estado", severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Gestionar Turnos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Paciente</strong></TableCell>
              <TableCell><strong>Profesional</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay turnos registrados.
                </TableCell>
              </TableRow>
            ) : (
              turnos.map((turno) => (
                <TableRow key={turno.id}>
                  <TableCell>{new Date(turno.fecha).toLocaleString()}</TableCell>
                  <TableCell>{turno.Paciente?.nombre} (DNI: {turno.Paciente?.dni})</TableCell>
                  <TableCell>{turno.Profesional?.Usuario?.nombre} ({turno.Profesional?.especialidad})</TableCell>
                  <TableCell>
                    <Select
                      value={turno.estado}
                      onChange={(e) => handleEstadoChange(turno.id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                      <MenuItem value="REALIZADO">Confirmado</MenuItem>
                      <MenuItem value="CANCELADO">Cancelado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleEliminarClick(turno)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmación *
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Seguro que deseas eliminar el turno del paciente <strong>{turnoSeleccionado?.Paciente?.nombre}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar *
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

export default GestionarTurno; */