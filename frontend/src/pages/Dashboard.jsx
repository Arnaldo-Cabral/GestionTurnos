import { useContext } from 'react';
import { Container, Typography, Button, Stack, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// Importamos el componente de lista que creamos antes
import ListaTurnosPendientes from '../components/ListaTurnosPendientes';

const Dashboard = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {usuario?.rol}
      </Typography>

      <Stack spacing={2} sx={{ my: 3 }}>
        {/* Opciones para ADMIN */}
        {usuario?.rol === 'ADMIN' && (
          <Button variant="contained" onClick={() => navigate('/usuarios')}>
            Administrar usuarios
          </Button>
        )}

        {/* Opciones para RECEPCIONISTA */}
        {usuario?.rol === 'RECEPCIONISTA' && (
          <>
            <Button variant="contained" onClick={() => navigate('/pacientes')}>
              Gestión pacientes
            </Button>
            <Button variant="contained" onClick={() => navigate('/turnos')}>
              Crear turnos
            </Button>
            <Button variant="contained" onClick={() => navigate('/turnos/gestion')}>
              Gestionar turnos
            </Button>
            <Button variant="contained" onClick={() => navigate('/historias')}>
              Historial de turnos
            </Button>
          </>
        )}

        {/* Opciones para PROFESIONAL */}
        {usuario?.rol === 'PROFESIONAL' && (
          <>
            {/* Agregamos el botón para ir a la página completa de turnos */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/mis-turnos')}
            >
              Ver próximos turnos
            </Button>

            <Button variant="contained" onClick={() => navigate('/historias')}>
              Consultar historias clínicas
            </Button>
            <Button variant="contained" onClick={() => navigate('/agenda')}>
              Cargar mi agenda de atención
            </Button>

            {/* SECCIÓN NUEVA: Vista rápida de turnos pendientes directamente en el Dashboard */}
            {/* <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="overline" color="textSecondary">
                  Tus próximos turnos
                </Typography>
              </Divider>
              <ListaTurnosPendientes />
            </Box> */}
          </>
        )}
      </Stack>

      {/* <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 2 }}>
        Cerrar sesión
      </Button> */}
    </Container>
  );
};

export default Dashboard;