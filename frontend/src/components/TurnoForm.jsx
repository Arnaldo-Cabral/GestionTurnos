// src/components/TurnoForm.jsx
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../services/api';

const TurnoForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    paciente_id: '',
    profesional_id: '',
    recepcionista_id: '',
    fecha: '',
    estado: 'PENDIENTE'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/turnos', form);
      onSuccess?.();
      setForm({ paciente_id: '', profesional_id: '', recepcionista_id: '', fecha: '', estado: 'PENDIENTE' });
    } catch (err) {
      alert('Error al crear turno');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField name="paciente_id" label="ID Paciente" value={form.paciente_id} onChange={handleChange} required />
      <TextField name="profesional_id" label="ID Profesional" value={form.profesional_id} onChange={handleChange} required />
      <TextField name="recepcionista_id" label="ID Recepcionista" value={form.recepcionista_id} onChange={handleChange} required />
      <TextField name="fecha" label="Fecha y hora" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.fecha} onChange={handleChange} required />
      <Button type="submit" variant="contained">Crear Turno</Button>
    </Box>
  );
};

export default TurnoForm;