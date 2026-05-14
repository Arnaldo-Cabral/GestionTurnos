import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Box
} from '@mui/material';
import api from '../services/api';
import PacienteForm from '../components/PacienteForm';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // 1. Lógica para calcular la edad dinámicamente
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  const cargarPacientes = async () => {
    try {
      const res = await api.get('/pacientes');
      setPacientes(res.data);
    } catch (error) {
      console.error("❌ Error al cargar pacientes:", error);
    }
  };

  useEffect(() => { cargarPacientes(); }, []);

  const handleGuardarEdicion = async () => {
    try {
      // Limpiamos los datos antes de enviar (trim)
      const payload = {
        ...pacienteSeleccionado,
        nombre: pacienteSeleccionado.nombre?.trim(),
        dni: pacienteSeleccionado.dni?.trim(),
        obra_social: pacienteSeleccionado.obra_social?.trim()
      };

      await api.put(`/pacientes/${pacienteSeleccionado.id}`, payload);
      setPacienteSeleccionado(null);
      cargarPacientes();
      alert("Paciente actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al editar paciente:", error);
      alert(error.response?.data?.error || "Error al editar");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Pacientes</Typography>

      <PacienteForm onSuccess={cargarPacientes} />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Listado de Pacientes</Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>DNI</strong></TableCell>
              <TableCell><strong>Obra Social</strong></TableCell>
              <TableCell><strong>Edad</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientes.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.dni}</TableCell>
                <TableCell>{p.obra_social || 'Particular'}</TableCell>
                <TableCell>{calcularEdad(p.fecha_nacimiento)}</TableCell>
                <TableCell>{p.telefono || '-'}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setPacienteSeleccionado(p)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para editar paciente completo */}
      <Dialog
        open={!!pacienteSeleccionado}
        onClose={() => setPacienteSeleccionado(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Modificar Datos del Paciente</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre Completo"
              value={pacienteSeleccionado?.nombre || ''}
              onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="DNI"
              value={pacienteSeleccionado?.dni || ''}
              onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, dni: e.target.value })}
              fullWidth
            />
            <TextField
              label="Obra Social / Prepaga"
              // 👈 Si p.obra_social es nulo o vacío, muestra 'Particular'
              value={pacienteSeleccionado?.obra_social || 'Particular'}
              onChange={(e) => setPacienteSeleccionado({
                ...pacienteSeleccionado,
                obra_social: e.target.value
              })}
              onFocus={(e) => e.target.select()}
              fullWidth
            />
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={pacienteSeleccionado?.fecha_nacimiento ? pacienteSeleccionado.fecha_nacimiento.split('T')[0] : ''}
              onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, fecha_nacimiento: e.target.value })}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={pacienteSeleccionado?.telefono || ''}
              onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, telefono: e.target.value })}
              fullWidth
            />
            <TextField
              label="Dirección"
              value={pacienteSeleccionado?.direccion || ''}
              onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, direccion: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPacienteSeleccionado(null)} color="inherit">Cancelar</Button>
          <Button onClick={handleGuardarEdicion} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pacientes;
