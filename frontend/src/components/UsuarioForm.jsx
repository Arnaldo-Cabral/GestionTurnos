import { useState } from 'react';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import api from '../services/api';

const roles = ['RECEPCIONISTA', 'PROFESIONAL'];

const UsuarioForm = ({ onUsuarioCreado }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    especialidad: '',
    matricula: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        rol: form.rol
      };

      if (form.rol === 'PROFESIONAL') {
        payload.especialidad = form.especialidad;
        payload.matricula = form.matricula;
      }

      const res = await api.post('/usuarios', payload);
      onUsuarioCreado(res.data);

      setForm({
        nombre: '',
        email: '',
        password: '',
        rol: '',
        especialidad: '',
        matricula: ''
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          select
          label="Rol"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          required
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>

        {form.rol === 'PROFESIONAL' && (
          <>
            <TextField
              label="Especialidad"
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              required
            />
            <TextField
              label="Matrícula"
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              required
            />
          </>
        )}

        <Button type="submit" variant="contained">Crear usuario</Button>
      </Stack>
    </form>
  );
};

export default UsuarioForm;