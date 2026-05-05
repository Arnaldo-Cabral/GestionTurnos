import { useEffect, useState, useContext } from 'react';
import { Container, Typography, List, Divider, TextField, Button, Box, Paper } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Historias = () => {
    const [historias, setHistorias] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const { usuario } = useContext(AuthContext);

    // Verificamos el rol del usuario actual
    const esRecepcionista = usuario?.rol === 'RECEPCIONISTA';

    const buscarHistorial = async () => {
        const termino = busqueda.trim();

        if (!termino) {
            setHistorias([]);
            return;
        }

        try {
            console.log("🚀 Buscando historias para:", termino);
            const res = await api.get(`/historias_clinicas/buscar`, {
                params: { query: termino }
            });

            setHistorias(res.data);
        } catch (err) {
            console.error("Error buscando:", err);
            alert("Hubo un error al realizar la búsqueda");
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            {/* <Typography variant="h4" gutterBottom>Consulta de Historias Clínicas</Typography> */}
            <Typography variant="h4" gutterBottom>
                {esRecepcionista ? "Historial de Turnos" : "Consulta de Historias Clínicas"}
            </Typography>

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

            <Typography variant="h6" sx={{ mb: 2 }}>Resultados</Typography>
            
            <List>
                {historias.length > 0 ? historias.map(h => {
                    const paciente = h.Turno?.Paciente?.nombre || 'Paciente desconocido';
                    const medico = h.Turno?.Profesional?.Usuario?.nombre || 'Médico no asignado';
                    const especialidad = h.Turno?.Profesional?.especialidad || 'Especialidad no definida';
                    const fecha = h.fecha_registro ? new Date(h.fecha_registro).toLocaleDateString() : 'Sin fecha';

                    return (
                        <Paper key={h.id} elevation={2} sx={{ mb: 2, p: 2 }}>
                            <Typography variant="subtitle1" color="primary">
                                <strong>Fecha: {fecha}</strong> — Paciente: {paciente}
                            </Typography>

                            <Typography variant="subtitle2" color="textSecondary">
                                Atendido por: <strong>{medico}</strong>
                                <span style={{ marginLeft: '10px', fontStyle: 'italic', color: '#666' }}>
                                    ({especialidad})
                                </span>
                            </Typography>

                            {!esRecepcionista ? (
                                <>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body1">
                                        <strong>Diagnóstico:</strong> {h.diagnostico}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>Tratamiento:</strong> {h.tratamiento}
                                    </Typography>

                                    {h.observaciones && (
                                        <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Observaciones:</strong> {h.observaciones}
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <Box sx={{ mt: 1 }}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>
                                        
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