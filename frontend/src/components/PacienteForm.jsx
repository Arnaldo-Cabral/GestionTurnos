// src/components/PacienteForm.jsx
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../services/api';

const PacienteForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pacientes', form);
      onSuccess?.();
      setForm({ nombre: '', dni: '', fecha_nacimiento: '', telefono: '', direccion: '' });
    } catch (err) {
      alert('Error al crear paciente');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField name="nombre" label="Nombre" value={form.nombre} onChange={handleChange} required />
      <TextField name="dni" label="DNI" value={form.dni} onChange={handleChange} required />
      <TextField name="fecha_nacimiento" label="Fecha de nacimiento" type="date" InputLabelProps={{ shrink: true }} value={form.fecha_nacimiento} onChange={handleChange} required />
      <TextField name="telefono" label="Teléfono" value={form.telefono} onChange={handleChange} />
      <TextField name="direccion" label="Dirección" value={form.direccion} onChange={handleChange} />
      <Button type="submit" variant="contained">Crear Paciente</Button>
    </Box>
  );
};

export default PacienteForm;