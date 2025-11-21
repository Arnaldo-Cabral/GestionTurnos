/* // src/pages/Pacientes.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, Divider } from '@mui/material';
import api from '../services/api';
import PacienteForm from '../components/PacienteForm';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);

  const cargarPacientes = async () => {
    const res = await api.get('/pacientes');
    setPacientes(res.data);
  };

  useEffect(() => { cargarPacientes(); }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Pacientes</Typography>
      <PacienteForm onSuccess={cargarPacientes} />
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Listado de Pacientes</Typography>
      <List>
        {pacientes.map(p => (
          <ListItem key={p.id}>{p.nombre} - DNI: {p.dni}</ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Pacientes; */


// src/pages/Pacientes.jsx
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
  Divider
} from '@mui/material';
import api from '../services/api';
import PacienteForm from '../components/PacienteForm';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // Cargar pacientes desde backend
  const cargarPacientes = async () => {
    try {
      const res = await api.get('/pacientes');
      setPacientes(res.data);
    } catch (error) {
      console.error("❌ Error al cargar pacientes:", error);
    }
  };

  useEffect(() => { cargarPacientes(); }, []);

  // Guardar edición
  const handleGuardarEdicion = async () => {
    try {
      await api.put(`/pacientes/${pacienteSeleccionado.id}`, pacienteSeleccionado);
      setPacienteSeleccionado(null);
      cargarPacientes();
    } catch (error) {
      console.error("❌ Error al editar paciente:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Pacientes</Typography>

      {/* Formulario para crear paciente */}
      <PacienteForm onSuccess={cargarPacientes} />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Listado de Pacientes</Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>DNI</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientes.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{p.dni}</TableCell>
                <TableCell>{p.telefono || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
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

      {/* Dialog para editar paciente */}
      <Dialog open={!!pacienteSeleccionado} onClose={() => setPacienteSeleccionado(null)}>
        <DialogTitle>Editar paciente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            value={pacienteSeleccionado?.nombre || ''}
            onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, nombre: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="DNI"
            value={pacienteSeleccionado?.dni || ''}
            onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, dni: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Teléfono"
            value={pacienteSeleccionado?.telefono || ''}
            onChange={(e) => setPacienteSeleccionado({ ...pacienteSeleccionado, telefono: e.target.value })}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPacienteSeleccionado(null)}>Cancelar</Button>
          <Button onClick={handleGuardarEdicion} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Pacientes;