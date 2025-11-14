// src/components/UsuarioForm.jsx
import { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import api from '../services/api';

const roles = ['ADMIN', 'RECEPCIONISTA', 'PROFESIONAL'];

const UsuarioForm = ({ usuario, onSuccess }) => {
  const [form, setForm] = useState(usuario);

  useEffect(() => {
    setForm(usuario);
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${usuario.id}`, form);
      alert('Usuario actualizado');
      onSuccess?.();
    } catch {
      alert('Error al actualizar usuario');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} />
      <TextField name="email" label="Email" value={form.email} onChange={handleChange} />
      <TextField select name="rol" label="Rol" value={form.rol} onChange={handleChange}>
        {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
      </TextField>
      <TextField select name="activo" label="Activo" value={form.activo} onChange={handleChange}>
        <MenuItem value={true}>Sí</MenuItem>
        <MenuItem value={false}>No</MenuItem>
      </TextField>
      <Button type="submit" variant="contained">Guardar Cambios</Button>
    </Box>
  );
};

export default UsuarioForm;