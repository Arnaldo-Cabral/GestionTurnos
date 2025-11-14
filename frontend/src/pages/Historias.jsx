// src/pages/Historias.jsx
import { useEffect, useState, useContext } from 'react';
import { Container, Typography, List, ListItem, Divider } from '@mui/material';
import api from '../services/api';
import HistoriaClinicaForm from '../components/HistoriaClinicaForm';
import { AuthContext } from '../context/AuthContext';

const Historias = () => {
    const [historias, setHistorias] = useState([]);
    const { usuario } = useContext(AuthContext);

    const cargarHistorias = async () => {
        const res = await api.get('/historias_clinicas');
        setHistorias(res.data);
    };

    useEffect(() => { cargarHistorias(); }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Historias Clínicas</Typography>

            {/* Solo el profesional puede crear o editar */}
            {usuario?.rol === 'PROFESIONAL' && (
                <>
                    <HistoriaClinicaForm onSuccess={cargarHistorias} />
                    <Divider sx={{ my: 3 }} />
                </>
            )}

            <Typography variant="h6">Listado</Typography>
            <List>
                {historias.map(h => {
                    const paciente = h.Turno?.Paciente?.nombre || 'Paciente desconocido';
                    const profesional = h.Turno?.Profesional?.Usuario?.nombre || 'Profesional desconocido';
                    return (
                        <ListItem key={h.id}>
                            <strong>Turno #{h.turno_id}</strong> — Paciente: {paciente} — Profesional: {profesional}
                            <br />
                            Diagnóstico: {h.diagnostico}
                        </ListItem>
                    );
                })}

            </List>
        </Container>
    );
};

export default Historias;