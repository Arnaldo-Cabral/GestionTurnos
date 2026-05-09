import { useState } from 'react';
import { TextField, Button, MenuItem, Stack, Typography } from '@mui/material';
import api from '../services/api';

const roles = ['RECEPCIONISTA', 'PROFESIONAL'];

const UsuarioForm = ({ onUsuarioCreado }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    especialidad: '',
    matricula: '',
    intervalo: 15 // 👈 Cambiado a 15 por defecto según tu preferencia
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparamos el payload base (Limpiamos espacios con trim)
      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        rol: form.rol
      };

      // Si es profesional, agregamos sus campos específicos
      if (form.rol === 'PROFESIONAL') {
        payload.especialidad = form.especialidad.trim();
        payload.matricula = form.matricula.trim();
        // Aseguramos que el intervalo viaje como un número entero
        payload.intervalo = parseInt(form.intervalo, 10) || 15;
      }

      const res = await api.post('/usuarios', payload);
      onUsuarioCreado(res.data);

      // Limpiamos el formulario tras la creación exitosa
      setForm({
        nombre: '',
        email: '',
        password: '',
        rol: '',
        especialidad: '',
        matricula: '',
        intervalo: 15
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Error al crear el usuario. Verifique los datos.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2 }}>Nuevo Registro</Typography>
      <Stack spacing={2}>
        <TextField label="Nombre Completo" name="nombre" value={form.nombre} onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <TextField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required />
        
        <TextField select label="Rol del Usuario" name="rol" value={form.rol} onChange={handleChange} required>
          {roles.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>

        {form.rol === 'PROFESIONAL' && (
          <>
            <TextField label="Especialidad" name="especialidad" value={form.especialidad} onChange={handleChange} required />
            <TextField label="Matrícula" name="matricula" value={form.matricula} onChange={handleChange} required />
            <TextField
              label="Duración del Turno (minutos)"
              name="intervalo"
              type="number"
              value={form.intervalo}
              onChange={handleChange}
              required
              helperText="Define el tiempo estándar de atención para este médico"
            />
          </>
        )}

        <Button type="submit" variant="contained" color="primary" size="large">
          Registrar Usuario
        </Button>
      </Stack>
    </form>
  );
};

export default UsuarioForm;
