// src/pages/Turnos.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, Divider } from '@mui/material';
import api from '../services/api';
import TurnoForm from '../components/TurnoForm';

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);

  const cargarTurnos = async () => {
    const res = await api.get('/turnos');
    setTurnos(res.data);
  };

  useEffect(() => { cargarTurnos(); }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Turnos</Typography>
      <TurnoForm onSuccess={cargarTurnos} />
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Listado de Turnos</Typography>
      <List>
        {turnos.map(t => (
          <ListItem key={t.id}>
            Turno #{t.id} - Paciente ID: {t.paciente_id} - Profesional ID: {t.profesional_id} - Estado: {t.estado}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Turnos;