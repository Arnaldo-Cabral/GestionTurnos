import { useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import SeleccionarProfesional from '../components/SeleccionarProfesional';
import TurnoForm from '../components/TurnoForm';

const Turnos = () => {
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);

  const handleSeleccion = (profesional) => {
    console.log("Médico elegido en el puente:", profesional);
    // Ahora 'profesional' es el objeto completo {id, especialidad, Usuario: {nombre}, ...}
    setProfesionalSeleccionado(profesional);
  };

  const handleSuccess = () => {
    // Podrías limpiar la selección tras el éxito o refrescar listas
    setProfesionalSeleccionado(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Reserva de Turnos
      </Typography>

      <Grid container spacing={3}>
        {/* IZQUIERDA: Buscador */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>1. Buscar Profesional</Typography>
            <SeleccionarProfesional onSelect={handleSeleccion} />
          </Paper>
        </Grid>

        {/* DERECHA: Formulario con Calendario */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>2. Completar Datos del Turno</Typography>
            {/* Pasamos el objeto completo 'profesionalSeleccionado' */}
            <TurnoForm
              profesionalExterno={profesionalSeleccionado}
              onSuccess={handleSuccess}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Turnos;