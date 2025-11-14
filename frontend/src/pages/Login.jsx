import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Ingresar</Button>
      </form>
    </Container>
  );
};

export default Login;