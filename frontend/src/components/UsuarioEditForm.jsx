import { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import api from '../services/api';

const roles = ['RECEPCIONISTA', 'PROFESIONAL'];

const UsuarioEditForm = ({ usuario, onUsuarioActualizado, onCancelar }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    activo: true,
    especialidad: '',
    matricula: '',
    intervalo: 20 // 👈 NUEVO: Valor inicial por defecto
  });

  useEffect(() => {
    setForm({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      password: '', // Siempre vacía para no mostrar el hash
      rol: usuario.rol || '',
      activo: usuario.activo,
      // Accedemos al objeto Profesional que viene de la DB
      especialidad: usuario.Profesional?.especialidad || '',
      matricula: usuario.Profesional?.matricula || '',
      intervalo: usuario.Profesional?.intervalo || 20
    });
  }, [usuario]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        rol: form.rol,
        activo: form.activo
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (form.rol === 'PROFESIONAL') {
        payload.especialidad = form.especialidad;
        payload.matricula = form.matricula;
        payload.intervalo = form.intervalo; // 👈 NUEVO: Se envía al backend para actualizar
      }

      const res = await api.put(`/usuarios/${usuario.id}`, payload);
      onUsuarioActualizado(res.data);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        <TextField label="Email" name="email" value={form.email} onChange={handleChange} required />
        <TextField label="Nueva contraseña (solo si desea cambiarla)" name="password" type="password" value={form.password} onChange={handleChange} />
        <TextField select label="Rol" name="rol" value={form.rol} onChange={handleChange} required>
          {roles.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Activo" name="activo" value={form.activo} onChange={handleChange}>
          <MenuItem value={true}>Sí</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </TextField>

        {form.rol === 'PROFESIONAL' && (
          <>
            <TextField label="Especialidad" name="especialidad" value={form.especialidad} onChange={handleChange} required />
            <TextField label="Matrícula" name="matricula" value={form.matricula} onChange={handleChange} required />
            {/* 👈 NUEVO: Campo para modificar el tiempo del turno */}
            <TextField
              label="Duración del Turno (minutos)"
              name="intervalo"
              type="number"
              value={form.intervalo}
              onChange={handleChange}
              required
              helperText="Determina el lapso entre turnos para este profesional"
            />
          </>
        )}

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained">Guardar cambios</Button>
          <Button variant="outlined" onClick={onCancelar}>Cancelar</Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default UsuarioEditForm;