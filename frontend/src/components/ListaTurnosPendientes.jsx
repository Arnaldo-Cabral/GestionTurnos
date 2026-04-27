import { useState, useEffect, useContext } from 'react';
import { getTurnosPendientes, atenderTurnoAPI } from '../services/turnoService';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Importamos api para la consulta rápida
import { 
  List, ListItem, ListItemText, Typography, Paper, Alert, 
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Accordion, AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ListaTurnosPendientes = () => {
  const [turnos, setTurnos] = useState([]);
  const [historialPrevio, setHistorialPrevio] = useState([]);
  const [errorInfo, setErrorInfo] = useState('');
  const { usuario } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [formAtencion, setFormAtencion] = useState({ diagnostico: '', tratamiento: '', observaciones: '' });

  const cargarTurnos = () => {
    if (usuario?.profesional_id) {
      getTurnosPendientes(usuario.profesional_id)
        .then(res => {
          setTurnos(Array.isArray(res.data) ? res.data : []);
          setErrorInfo(res.data.length === 0 ? 'No hay turnos para hoy.' : '');
        })
        .catch(() => setErrorInfo('Error al conectar con el servidor.'));
    }
  };

  useEffect(() => { cargarTurnos(); }, [usuario]);

  const handleAtenderClick = async (turno) => {
    setTurnoSeleccionado(turno);
    setHistorialPrevio([]); // Limpiar historial anterior
    
    // 🔍 Buscar historial del paciente antes de abrir
    try {
      const res = await api.get(`/turnos/paciente/${turno.paciente_id}/historial`);
      setHistorialPrevio(res.data);
    } catch (err) {
      console.error("No se pudo cargar el historial previo");
    }
    
    setOpen(true);
  };

  const handleConfirmarAtencion = async () => {
    try {
      await atenderTurnoAPI(turnoSeleccionado.id, formAtencion);
      setOpen(false);
      setFormAtencion({ diagnostico: '', tratamiento: '', observaciones: '' });
      cargarTurnos();
    } catch (error) {
      alert("Error al guardar la atención");
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Próximos Pacientes</Typography>
      {errorInfo && <Alert severity="info" sx={{ mb: 2 }}>{errorInfo}</Alert>}
      
      <List>
        {turnos.map(turno => (
          <ListItem 
            key={turno.id} 
            divider
            secondaryAction={
              <Button variant="contained" color="success" onClick={() => handleAtenderClick(turno)}>
                Atender
              </Button>
            }
          >
            <ListItemText 
              primary={turno.Paciente?.nombre || 'Paciente desconocido'} 
              secondary={`DNI: ${turno.Paciente?.dni} | Turno #${turno.id}`} 
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Atención Médica: {turnoSeleccionado?.Paciente?.nombre}
        </DialogTitle>
        <DialogContent dividers>
          
          {/* --- SECCIÓN DE HISTORIAL --- */}
          <Typography variant="h6" color="primary" gutterBottom>Historial Clínico Previo</Typography>
          {historialPrevio.length > 0 ? (
            historialPrevio.map((h) => (
              <Accordion key={h.id} sx={{ mb: 1, bgcolor: '#f9f9f9' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography><strong>Fecha:</strong> {new Date(h.createdAt).toLocaleDateString()} - <strong>Dr/a:</strong> {h.Turno?.Profesional?.Usuario?.nombre}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2"><strong>Diagnóstico:</strong> {h.diagnostico}</Typography>
                  <Typography variant="body2"><strong>Tratamiento:</strong> {h.tratamiento}</Typography>
                  <Typography variant="body2"><strong>Observaciones:</strong> {h.observaciones}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>El paciente no registra atenciones previas.</Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* --- FORMULARIO DE NUEVA ATENCIÓN --- */}
          <Typography variant="h6" color="secondary" gutterBottom>Nueva Entrada (Hoy)</Typography>
          <TextField
            label="Diagnóstico Actual"
            fullWidth multiline rows={3} margin="normal"
            value={formAtencion.diagnostico}
            onChange={(e) => setFormAtencion({...formAtencion, diagnostico: e.target.value})}
          />
          <TextField
            label="Tratamiento / Indicaciones"
            fullWidth multiline rows={3} margin="normal"
            value={formAtencion.tratamiento}
            onChange={(e) => setFormAtencion({...formAtencion, tratamiento: e.target.value})}
          />
          <TextField
            label="Observaciones Internas"
            fullWidth multiline rows={2} margin="normal"
            value={formAtencion.observaciones}
            onChange={(e) => setFormAtencion({...formAtencion, observaciones: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmarAtencion} variant="contained" color="primary">
            Finalizar y Guardar Atención
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ListaTurnosPendientes;