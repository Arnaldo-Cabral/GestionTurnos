import { useState, useEffect, useContext } from 'react';
import { getTurnosPendientes } from '../services/turnoService';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; 
import {
  List, ListItem, ListItemText, Typography, Paper, Alert,
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Accordion, AccordionSummary, AccordionDetails, Divider, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ListaTurnosPendientes = () => {
  const [turnos, setTurnos] = useState([]);
  const [historialPrevio, setHistorialPrevio] = useState([]);
  const [errorInfo, setErrorInfo] = useState('');
  const { usuario } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [formAtencion, setFormAtencion] = useState({ 
    motivo_consulta: '', 
    diagnostico: '', 
    tratamiento: '', 
    observaciones: '' 
  });

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return {
      dia: fecha.toLocaleDateString('es-AR'),
      hora: fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };
  };

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

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return edad;
  };

  useEffect(() => { cargarTurnos(); }, [usuario]);

  const handleAtenderClick = async (turno) => {
    setTurnoSeleccionado(turno);
    setHistorialPrevio([]);
    const idPaciente = turno.paciente_id || turno.Paciente?.id;

    if (idPaciente) {
      try {
        const res = await api.get(`/turnos/paciente/${idPaciente}/historial`);
        setHistorialPrevio(res.data);
      } catch (err) {
        console.error("No se pudo cargar el historial previo", err);
      }
    }
    setOpen(true);
  };

  const handleConfirmarAtencion = async () => {
    try {
      const datosParaEnviar = { ...formAtencion, turno_id: turnoSeleccionado.id };
      await api.post('/historias_clinicas', datosParaEnviar);
      setOpen(false);
      setFormAtencion({ motivo_consulta: '', diagnostico: '', tratamiento: '', observaciones: '' });
      cargarTurnos(); 
    } catch (error) {
      alert(error.response?.data?.error || "Error al guardar la atención");
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Próximos Pacientes
      </Typography>
      {errorInfo && <Alert severity="info" sx={{ mb: 2 }}>{errorInfo}</Alert>}

      <List>
        {turnos.map(turno => {
          const { hora } = formatearFecha(turno.fecha);
          return (
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
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {hora} hs — {turno.Paciente?.nombre} ({calcularEdad(turno.Paciente?.fecha_nacimiento)} años)
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    OS: <strong>{turno.Paciente?.obra_social || 'Particular'}</strong> | DNI: {turno.Paciente?.dni}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* MODAL OPTIMIZADO: maxWidth="lg" y espaciado reducido */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', py: 1.5, px: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Atención Médica: {turnoSeleccionado?.Paciente?.nombre} ({calcularEdad(turnoSeleccionado?.Paciente?.fecha_nacimiento)} años)
          </Typography>
          <Box sx={{ mt: 0.5, display: 'flex', gap: 4, opacity: 0.9 }}>
            <Typography variant="body1"><strong>DNI:</strong> {turnoSeleccionado?.Paciente?.dni}</Typography>
            <Typography variant="body1"><strong>Obra Social:</strong> {turnoSeleccionado?.Paciente?.obra_social || 'Particular'}</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 1.5 }}>
          {/* Historial previo comprimido */}
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            HISTORIAL CLÍNICO PREVIO
          </Typography>
          <Box sx={{ maxHeight: '120px', overflowY: 'auto', mb: 1.5, p: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fcfcfc' }}>
            {historialPrevio.length > 0 ? (
              historialPrevio.map((h) => (
                <Accordion key={h.id} sx={{ mb: 0.5, boxShadow: 0, border: '1px solid #eee' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 36, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      <strong>{new Date(h.fecha_registro).toLocaleDateString()}</strong> - {h.Turno?.Profesional?.Usuario?.nombre}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}><strong>Motivo:</strong> {h.motivo_consulta}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}><strong>Diagnóstico:</strong> {h.diagnostico}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}><strong>Tratamiento:</strong> {h.tratamiento}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}><strong>Observación:</strong> {h.observaciones}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant="caption" color="text.secondary">No hay registros previos.</Typography>
            )}
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* Formulario de carga con mayor superficie útil */}
          <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 'bold', mb: 1 }}>
            NUEVA ENTRADA (HOY)
          </Typography>

          <TextField
            label="Motivo de la Consulta *"
            fullWidth
            size="small"
            margin="dense"
            value={formAtencion.motivo_consulta}
            onChange={(e) => setFormAtencion({ ...formAtencion, motivo_consulta: e.target.value })}
          />
          <TextField
            label="Diagnóstico Actual *"
            fullWidth
            multiline
            rows={5}
            margin="dense"
            value={formAtencion.diagnostico}
            onChange={(e) => setFormAtencion({ ...formAtencion, diagnostico: e.target.value })}
          />
          <TextField
            label="Tratamiento / Indicaciones *"
            fullWidth
            multiline
            rows={5}
            margin="dense"
            value={formAtencion.tratamiento}
            onChange={(e) => setFormAtencion({ ...formAtencion, tratamiento: e.target.value })}
          />
          <TextField
            label="Observaciones Internas"
            fullWidth
            multiline
            rows={2}
            margin="dense"
            value={formAtencion.observaciones}
            onChange={(e) => setFormAtencion({ ...formAtencion, observaciones: e.target.value })}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ fontWeight: 'bold' }}>CANCELAR</Button>
          <Button onClick={handleConfirmarAtencion} variant="contained" color="primary" sx={{ fontWeight: 'bold', px: 4 }}>
            FINALIZAR Y GUARDAR ATENCIÓN
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ListaTurnosPendientes;

/* import { useState, useEffect, useContext } from 'react';
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
  const [formAtencion, setFormAtencion] = useState({ motivo_consulta: '', diagnostico: '', tratamiento: '', observaciones: '' });

  // Función auxiliar para formatear la fecha y hora
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return {
      dia: fecha.toLocaleDateString('es-AR'),
      hora: fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };
  };

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

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return edad;
  };

  useEffect(() => { cargarTurnos(); }, [usuario]);

  const handleAtenderClick = async (turno) => {
    // 🔍 Paso 1: Log para ver qué datos tiene el objeto en realidad
    console.log("Datos del turno:", turno);

    setTurnoSeleccionado(turno);
    setHistorialPrevio([]);

    // 🔍 Paso 2: Intentamos obtener el ID del paciente de varias formas
    const idPaciente = turno.paciente_id || turno.Paciente?.id;

    console.log("🔍 Enviando ID al backend:", idPaciente);

    if (!idPaciente) {
      console.error("❌ No se encontró el paciente_id en el objeto turno");
      setOpen(true); // Abrimos igual para atender, aunque no haya historial
      return;
    }

    try {
      // Usamos el ID que detectamos arriba
      const res = await api.get(`/turnos/paciente/${idPaciente}/historial`);
      setHistorialPrevio(res.data);
    } catch (err) {
      console.error("No se pudo cargar el historial previo", err);
    }

    setOpen(true);
  };

  // 2. Modifica la función handleConfirmarAtencion
  const handleConfirmarAtencion = async () => {
    try {
      // Preparamos los datos incluyendo el turno_id que tenemos en turnoSeleccionado
      const datosParaEnviar = {
        ...formAtencion,
        turno_id: turnoSeleccionado.id // 👈 Crucial para el Backend
      };

      // Llamamos directamente a la API de historias clínicas
      await api.post('/historias_clinicas', datosParaEnviar);

      setOpen(false);
      // Limpiamos el formulario
      setFormAtencion({ motivo_consulta: '', diagnostico: '', tratamiento: '', observaciones: '' });
      cargarTurnos(); // 👈 Esto hará el "refresh" automático de la lista
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error al guardar la atención");
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Próximos Pacientes</Typography>
      {errorInfo && <Alert severity="info" sx={{ mb: 2 }}>{errorInfo}</Alert>}

      <List>
        {turnos.map(turno => {
          const { dia, hora } = formatearFecha(turno.fecha); // Extraemos hora y día
          return (
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
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {hora} hs — {turno.Paciente?.nombre || 'Paciente desconocido'}
                    <span style={{ fontWeight: 'normal', fontSize: '0.9rem', marginLeft: '10px' }}>
                      ({calcularEdad(turno.Paciente?.fecha_nacimiento)} años)
                    </span>
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block">
                      OS: <strong>{turno.Paciente?.obra_social || 'Particular'}</strong> | DNI: {turno.Paciente?.dni}
                    </Typography>
                    {/* Asegúrate de que no haya llaves con espacios vacíos aquí 
                    <Typography variant="caption" color="text.secondary">
                      ID Turno: #{turno.id} | Estado: {turno.estado}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Atención Médica: {turnoSeleccionado?.Paciente?.nombre}
        </DialogTitle>
        <DialogContent dividers>

          {/* --- SECCIÓN DE HISTORIAL --- 
          <Typography variant="h6" color="primary" gutterBottom>Historial Clínico Previo</Typography>
          {historialPrevio.length > 0 ? (
            historialPrevio.map((h) => (
              <Accordion key={h.id} sx={{ mb: 1, bgcolor: '#f9f9f9' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    <strong>Fecha:</strong> {new Date(h.fecha_registro).toLocaleDateString()} -
                    <strong> Dr/a:</strong> {h.Turno?.Profesional?.Usuario?.nombre || 'No asignado'}
                  </Typography>
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

          {/* --- FORMULARIO DE NUEVA ATENCIÓN --- 
          <Typography variant="h6" color="secondary" gutterBottom>Nueva Entrada (Hoy)</Typography>
          <TextField
            label="Motivo de la Consulta *"
            fullWidth
            margin="normal"
            value={formAtencion.motivo_consulta}
            onChange={(e) => setFormAtencion({ ...formAtencion, motivo_consulta: e.target.value })}
          />
          <TextField
            label="Diagnóstico Actual"
            fullWidth multiline rows={3} margin="normal"
            value={formAtencion.diagnostico}
            onChange={(e) => setFormAtencion({ ...formAtencion, diagnostico: e.target.value })}
          />
          <TextField
            label="Tratamiento / Indicaciones"
            fullWidth multiline rows={3} margin="normal"
            value={formAtencion.tratamiento}
            onChange={(e) => setFormAtencion({ ...formAtencion, tratamiento: e.target.value })}
          />
          <TextField
            label="Observaciones Internas"
            fullWidth multiline rows={2} margin="normal"
            value={formAtencion.observaciones}
            onChange={(e) => setFormAtencion({ ...formAtencion, observaciones: e.target.value })}
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

export default ListaTurnosPendientes; */