/* import { useState, useEffect, useContext } from 'react';
import { getTurnosPendientes } from '../services/turnoService';
import { AuthContext } from '../context/AuthContext';
import { List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

const ListaTurnosPendientes = () => {
  const [turnos, setTurnos] = useState([]);
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    // IMPORTANTE: Asegurate de que usuario.profesional_id venga en el token/contexto
    // Si no, tendrás que hacer un fetch previo para obtener el ID de profesional
    if (usuario?.profesional_id) {
      getTurnosPendientes(usuario.profesional_id)
        .then(res => setTurnos(res.data))
        .catch(err => console.error("Error al traer turnos", err));
    }
  }, [usuario]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Mis Turnos Pendientes</Typography>
      <List>
        {turnos.length > 0 ? turnos.map(turno => (
          <ListItem key={turno.id} divider>
            <ListItemText 
              primary={`Paciente: ${turno.Paciente?.nombre}`} 
              secondary={`Fecha: ${new Date(turno.fecha).toLocaleString()} - DNI: ${turno.Paciente?.dni}`}
            />
          </ListItem>
        )) : (
          <Typography variant="body2">No tienes turnos pendientes.</Typography>
        )}
      </List>
    </Paper>
  );
};
export default ListaTurnosPendientes; */
import { useState, useEffect, useContext } from 'react';
import { getTurnosPendientes } from '../services/turnoService';
import { AuthContext } from '../context/AuthContext';
import { List, ListItem, ListItemText, Typography, Paper, Alert } from '@mui/material';

const ListaTurnosPendientes = () => {
  const [turnos, setTurnos] = useState([]);
  const [errorInfo, setErrorInfo] = useState('');
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    // 1. Verificamos si el objeto usuario existe y qué tiene
    if (!usuario) {
      setErrorInfo('No hay información de usuario logueado.');
      return;
    }

    if (!usuario.profesional_id) {
      setErrorInfo(`Logueado como ${usuario.rol}, pero NO existe profesional_id en el sistema.`);
      return;
    }

    // 2. Si llegamos acá, intentamos llamar a la API
    getTurnosPendientes(usuario.profesional_id)
      .then(res => {
        console.log("Datos recibidos:", res.data);
        setTurnos(res.data);
        if (res.data.length === 0) {
          setErrorInfo('La base de datos respondió, pero no hay turnos PENDIENTES para este ID.');
        } else {
          setErrorInfo(''); // Limpiamos errores si hay datos
        }
      })
      .catch(err => {
        console.error(err);
        setErrorInfo('Error de conexión: El backend no responde o la ruta no existe.');
      });
  }, [usuario]);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Estado de la consulta:</Typography>
      
      {/* Este cartel nos dirá la verdad */}
      {errorInfo && <Alert severity="info" sx={{ mb: 2 }}>{errorInfo}</Alert>}

      <Typography variant="h6">Lista de Turnos:</Typography>
      <List>
        {turnos.length > 0 ? turnos.map(turno => (
          <ListItem key={turno.id} divider>
            <ListItemText 
              primary={`Paciente: ${turno.Paciente?.nombre || 'Sin nombre'}`} 
              secondary={`Fecha: ${new Date(turno.fecha).toLocaleString()}`}
            />
          </ListItem>
        )) : (
          <Typography variant="body2">Sin resultados para mostrar.</Typography>
        )}
      </List>
    </Paper>
  );
};

export default ListaTurnosPendientes;