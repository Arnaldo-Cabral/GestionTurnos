// src/pages/Pacientes.jsx
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

export default Pacientes;