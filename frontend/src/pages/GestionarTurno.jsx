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

      {/* Dialog de confirmación */}
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

      {/* Snackbar */}
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