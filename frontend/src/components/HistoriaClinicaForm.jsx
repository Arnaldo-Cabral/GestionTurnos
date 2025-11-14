// src/components/HistoriaClinicaForm.jsx
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../services/api';

const HistoriaClinicaForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    turno_id: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/historias_clinicas', form);
      onSuccess?.();
      setForm({ turno_id: '', diagnostico: '', tratamiento: '', observaciones: '' });
    } catch (err) {
      alert('Error al guardar historia clínica');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField name="turno_id" label="ID del Turno" value={form.turno_id} onChange={handleChange} required />
      <TextField name="diagnostico" label="Diagnóstico" multiline value={form.diagnostico} onChange={handleChange} required />
      <TextField name="tratamiento" label="Tratamiento" multiline value={form.tratamiento} onChange={handleChange} required />
      <TextField name="observaciones" label="Observaciones" multiline value={form.observaciones} onChange={handleChange} />
      <Button type="submit" variant="contained">Guardar Historia Clínica</Button>
    </Box>
  );
};

export default HistoriaClinicaForm;