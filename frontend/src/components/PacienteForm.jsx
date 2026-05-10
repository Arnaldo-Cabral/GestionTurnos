import { useState } from 'react';
import { TextField, Button, Box, Alert, Typography } from '@mui/material';
import api from '../services/api';

const PacienteForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    obra_social: 'Particular' // 👈 Valor por defecto
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Preparamos los datos con trim()
    const payload = {
      ...form,
      nombre: form.nombre.trim(),
      dni: form.dni.trim(),
      obra_social: form.obra_social.trim() || 'Particular'
    };

    try {
      await api.post('/pacientes', payload);
      alert('¡Paciente creado con éxito!'); // Feedback rápido
      onSuccess?.();
      setForm({ nombre: '', dni: '', fecha_nacimiento: '', telefono: '', direccion: '', obra_social: '' });
    } catch (err) {
      const mensaje = err.response?.data?.error || 'Error al crear paciente';
      setErrorMsg(mensaje);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h6">Registrar Nuevo Paciente</Typography>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <TextField name="nombre" label="Nombre Completo" value={form.nombre} onChange={handleChange} required />
      <TextField name="dni" label="DNI (Sin puntos)" value={form.dni} onChange={handleChange} required />
      <TextField name="obra_social" label="Obra Social / Prepaga" value={form.obra_social} onChange={handleChange}
        onFocus={(e) => e.target.select()} helperText="Si no tiene, dejar como Particular" />
      <TextField name="fecha_nacimiento" label="Fecha de nacimiento" type="date" InputLabelProps={{ shrink: true }} value={form.fecha_nacimiento} onChange={handleChange} required />
      <TextField name="telefono" label="Teléfono de contacto" value={form.telefono} onChange={handleChange} />
      <TextField name="direccion" label="Dirección" value={form.direccion} onChange={handleChange} />

      <Button type="submit" variant="contained" size="large">Crear Paciente</Button>
    </Box>
  );
};

export default PacienteForm;

// src/components/PacienteForm.jsx
/* import { useState } from 'react';
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

export default PacienteForm; */