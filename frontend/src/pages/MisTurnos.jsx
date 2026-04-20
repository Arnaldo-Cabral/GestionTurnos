import { Container, Typography, Box } from '@mui/material';
import ListaTurnosPendientes from '../components/ListaTurnosPendientes';

const MisTurnos = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Agenda de Turnos
      </Typography>
      <Box sx={{ mt: 3 }}>
        <ListaTurnosPendientes />
      </Box>
    </Container>
  );
};

export default MisTurnos;