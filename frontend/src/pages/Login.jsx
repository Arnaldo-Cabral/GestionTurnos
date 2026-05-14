import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Alert, Box } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await api.post('/auth/login', { email, password });
      // PASAMOS TODO EL OBJETO (token + usuario con sus IDs)
      login(res.data); 
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al conectar con el servidor';
      setErrorMsg(mensaje);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
          GestionTurnos
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField 
            label="Email" 
            fullWidth 
            margin="normal" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <TextField 
            label="Contraseña" 
            type="password" 
            fullWidth 
            margin="normal" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large" 
            sx={{ mt: 3 }}
          >
            Ingresar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;

/* import { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom'; // 👈 Ya no lo necesitamos aquí, lo hace el Context
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // 👈 NUEVO: Para mostrar errores en pantalla
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Limpiar errores previos

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      // El navigate lo hace el AuthContext automáticamente
    } catch (err) {
      // 🛡️ CAPTURA EL ERROR DEL BACKEND (Bloqueado, clave mal, etc.)
      const mensaje = err.response?.data?.error || 'Error al conectar con el servidor';
      setErrorMsg(mensaje);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        GestionTurnos
      </Typography>
      
      <form onSubmit={handleSubmit}>
        {/* 👈 NUEVO: Alerta visual más profesional que el alert de navegador 
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <TextField 
          label="Email" 
          fullWidth 
          margin="normal" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required
        />
        <TextField 
          label="Contraseña" 
          type="password" 
          fullWidth 
          margin="normal" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          size="large" 
          sx={{ mt: 2 }}
        >
          Ingresar
        </Button>
      </form>
    </Container>
  );
};

export default Login; */