import React from 'react';
import { Container, Typography } from '@mui/material';
import AgendaList from '../components/AgendaList';
import AgendaForm from '../components/AgendaForm'; // si lo guardaste en components


const Agenda = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Cargar agenda de atención
            </Typography>
            <AgendaForm />
            <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
                Bloques cargados
            </Typography>
            <AgendaList />
        </Container>
    );
};

export default Agenda;