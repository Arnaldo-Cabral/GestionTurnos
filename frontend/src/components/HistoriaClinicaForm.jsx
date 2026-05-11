import { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import api from '../services/api';

const HistoriaClinicaForm = ({ turnoId, onSuccess }) => {
  const [form, setForm] = useState({
    turno_id: turnoId || '',
    motivo_consulta: '', // 👈 Campo nuevo
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación visual antes de llamar a la API
    if (!form.motivo_consulta.trim() || !form.diagnostico.trim() || !form.tratamiento.trim()) {
      setError('Por favor, complete todos los campos obligatorios (*)');
      return;
    }

    try {
      await api.post('/historias_clinicas', form);
      alert('Atención médica guardada permanentemente.');
      onSuccess?.();
      setForm({ turno_id: '', motivo_consulta: '', diagnostico: '', tratamiento: '', observaciones: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, p: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField 
        name="motivo_consulta" 
        label="Motivo de la Consulta *" 
        value={form.motivo_consulta} 
        onChange={handleChange} 
        required 
      />
      <TextField 
        name="diagnostico" 
        label="Diagnóstico *" 
        multiline 
        rows={3} 
        value={form.diagnostico} 
        onChange={handleChange} 
        required 
      />
      <TextField 
        name="tratamiento" 
        label="Tratamiento / Plan *" 
        multiline 
        rows={3} 
        value={form.tratamiento} 
        onChange={handleChange} 
        required 
      />
      <TextField 
        name="observaciones" 
        label="Observaciones" 
        multiline 
        value={form.observaciones} 
        onChange={handleChange} 
      />
      
      <Button type="submit" variant="contained" color="primary" size="large">
        Finalizar y Guardar Atención
      </Button>
    </Box>
  );
};