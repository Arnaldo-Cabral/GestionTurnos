import { useEffect, useState, useContext } from 'react';
import { Container, Typography, List, ListItem, Divider, TextField, Button, Box, Paper } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Historias = () => {
    const [historias, setHistorias] = useState([]);
    const [busqueda, setBusqueda] = useState(''); // Estado para el buscador
    const { usuario } = useContext(AuthContext);

    // Función para buscar por DNI o Nombre
    const buscarHistorial = async () => {
        // Trim para evitar espacios en blanco accidentales
        const termino = busqueda.trim();

        if (!termino) {
            setHistorias([]); // Limpia la pantalla si borran el buscador
            return;
        }

        try {
            console.log("🚀 Enviando petición de búsqueda para:", termino);
            const res = await api.get(`/historias_clinicas/buscar`, {
                params: { query: termino } // Forma más limpia de enviar query params
            });

            setHistorias(res.data);
        } catch (err) {
            console.error("Error buscando:", err);
            alert("Hubo un error al realizar la búsqueda");
        }
    };

    /* useEffect(() => { cargarHistorias(); }, []); */ //evita que el sistema cargue a todos los pacientes apenas abrís la página.

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Consulta de Historias Clínicas</Typography>

            {/* BUSCADOR */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    label="Buscar por Nombre o DNI de Paciente"
                    variant="outlined"
                    fullWidth
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && buscarHistorial()}
                />
                <Button variant="contained" onClick={buscarHistorial} size="large">
                    Buscar
                </Button>
            </Paper>

            <Typography variant="h6">Resultados</Typography>
            <List>
                {historias.length > 0 ? historias.map(h => {
                    // 1. Datos del Paciente
                    const paciente = h.Turno?.Paciente?.nombre || 'Paciente desconocido';

                    // 2. Datos del Médico (Fijate bien en la ruta de los puntos)
                    const medico = h.Turno?.Profesional?.Usuario?.nombre || 'Médico no asignado';
                    const especialidad = h.Turno?.Profesional?.especialidad || 'Especialidad no definida';

                    // 3. Formateo de Fecha
                    const fecha = h.fecha_registro ? new Date(h.fecha_registro).toLocaleDateString() : 'Sin fecha';

                    return (
                        <Paper key={h.id} elevation={2} sx={{ mb: 2, p: 2 }}>
                            <Typography variant="subtitle1" color="primary">
                                <strong>Fecha: {fecha}</strong> — Paciente: {paciente}
                            </Typography>

                            {/* Si el médico existe, lo mostramos claramente */}
                            <Typography variant="subtitle2" color="textSecondary">
                                Atendido por: <strong>{medico}</strong>
                                <span style={{ marginLeft: '10px', fontStyle: 'italic', color: '#666' }}>
                                    ({especialidad})
                                </span>
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="body1">
                                <strong>Diagnóstico:</strong> {h.diagnostico}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Tratamiento:</strong> {h.tratamiento}
                            </Typography>

                            {/* VOLVEMOS A RENDERIZAR LAS OBSERVACIONES */}
                            {h.observaciones && (
                                <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Observaciones:</strong> {h.observaciones}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    );
                }) : (
                    <Typography color="textSecondary">No se encontraron registros.</Typography>
                )}
            </List>
        </Container>
    );
};

export default Historias;