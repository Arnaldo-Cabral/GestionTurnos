import { useContext } from 'react';
import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
          <>
            <Button variant="contained" onClick={() => navigate('/usuarios')}>
              Administrar usuarios
            </Button>
            <Button variant="contained" onClick={() => navigate('/pacientes')}>
              Ver pacientes
            </Button>
            <Button variant="contained" onClick={() => navigate('/turnos')}>
              Ver turnos
            </Button>
          </>
        )}

        {/* Opciones para RECEPCIONISTA */}
        {usuario?.rol === 'RECEPCIONISTA' && (
          <>
            <Button variant="contained" onClick={() => navigate('/pacientes')}>
              Ver pacientes
            </Button>
            <Button variant="contained" onClick={() => navigate('/turnos')}>
              Ver turnos
            </Button>
            <Button variant="contained" onClick={() => navigate('/historias')}>
              Ver historias clínicas
            </Button>
          </>
        )}

        {/* Opciones para PROFESIONAL */}
        {usuario?.rol === 'PROFESIONAL' && (
          <>
            <Button variant="contained" onClick={() => navigate('/historias')}>
              Gestionar historias clínicas
            </Button>
          </>
        )}
      </Stack>

      <Button variant="outlined" color="error" onClick={logout}>
        Cerrar sesión
      </Button>
    </Container>
  );
};

export default Dashboard;