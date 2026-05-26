import { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthContext } from '../context/AuthContext';

// IMPORTANTE: Importar configuración de idioma para Argentina
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 

// Configurar dayjs en español
dayjs.locale('es');

const TurnoForm = ({ profesionalExterno, onSuccess }) => {
  const { usuario } = useContext(AuthContext);

  const [form, setForm] = useState({
    dni_paciente: '',
    paciente_id: '',
    profesional_id: '',
    recepcionista_id: '',
    fecha: '',
    estado: 'PENDIENTE'
  });

  const [nombreProfesional, setNombreProfesional] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [diasLaborales, setDiasLaborales] = useState([]);
  const [nombrePaciente, setNombrePaciente] = useState('');

  // Sincronizar profesional elegido cuando viene de afuera (Select de la izquierda)
  useEffect(() => {
    if (profesionalExterno) {
      setForm(prev => ({ ...prev, profesional_id: profesionalExterno.id }));
      setNombreProfesional(profesionalExterno.Usuario?.nombre || 'Médico');
    } else {
      // Si profesionalExterno es null, limpiamos los campos relacionados
      setForm(prev => ({ ...prev, profesional_id: '' }));
      setNombreProfesional('');
    }
  }, [profesionalExterno]);

  // Buscar paciente por DNI
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (form.dni_paciente.length >= 7) {
        try {
          const res = await api.get(`/pacientes/buscar?dni=${form.dni_paciente}`);
          setNombrePaciente(`✅ ${res.data.nombre}`);
          setForm(prev => ({ ...prev, paciente_id: res.data.id }));
        } catch (err) {
          setNombrePaciente('❌ No encontrado');
          setForm(prev => ({ ...prev, paciente_id: '' }));
        }
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [form.dni_paciente]);

  // Cargar días que atiende el profesional
  useEffect(() => {
    if (form.profesional_id) {
      api.get(`/agenda/profesional/${form.profesional_id}`).then(res => {
        const mapeo = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
        setDiasLaborales(res.data.map(i => mapeo[i.dia_semana]));
      });
    } else {
      setDiasLaborales([]);
    }
  }, [form.profesional_id]);

  // Cargar horas disponibles según fecha
  useEffect(() => {
    if (form.profesional_id && fechaSeleccionada) {
      api.get(`/agenda/disponibilidad?profesional_id=${form.profesional_id}&fecha=${fechaSeleccionada.format('YYYY-MM-DD')}`)
        .then(res => setDisponibilidad(res.data.disponibles || []));
    } else {
      setDisponibilidad([]);
    }
  }, [form.profesional_id, fechaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recepId = usuario?.recepcionista_id;

    if (!recepId) {
      alert("Error: Tu perfil no tiene un ID de recepcionista vinculado. Por favor, cierra sesión y vuelve a entrar.");
      return;
    }

    const payload = { ...form, recepcionista_id: recepId };

    try {
      await api.post('/turnos', payload);
      alert("✅ Turno creado con éxito");
      
      // DISPARADOR DE LIMPIEZA TOTAL
      onSuccess?.(); // Avisamos al padre (Dashboard) que el turno se creó
      
      // 1. Resetear el objeto form principal
      setForm({
        dni_paciente: '',
        paciente_id: '',
        profesional_id: '',
        recepcionista_id: recepId,
        fecha: '',
        estado: 'PENDIENTE'
      });

      // 2. Resetear todos los estados visuales auxiliares
      setNombreProfesional('');
      setFechaSeleccionada(null);
      setNombrePaciente('');
      setDisponibilidad([]);
      setDiasLaborales([]);

    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Error de servidor"}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
        <TextField
          label="DNI del Paciente"
          value={form.dni_paciente}
          onChange={(e) => setForm({ ...form, dni_paciente: e.target.value })}
          helperText={nombrePaciente}
          required
          fullWidth
        />
        
        {/* Este campo ahora se vacía correctamente al setear nombreProfesional en '' */}
        <TextField 
          label="Profesional" 
          value={nombreProfesional} 
          InputProps={{ readOnly: true }} 
          variant="filled" 
          fullWidth 
        />
        
        <DatePicker
          label="Fecha del Turno"
          value={fechaSeleccionada}
          onChange={(val) => setFechaSeleccionada(val)}
          disablePast
          format="DD/MM/YYYY"
          shouldDisableDate={(date) => diasLaborales.length > 0 && !diasLaborales.includes(date.day())}
          slotProps={{ 
            textField: { 
              fullWidth: true, 
              required: true,
              helperText: "Día/Mes/Año"
            } 
          }}
        />

        <TextField
          select
          label="Horario Disponible"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          disabled={!disponibilidad.length}
          required
          fullWidth
        >
          {disponibilidad.map((d, index) => (
            <MenuItem key={index} value={d.fecha}>{d.hora} hs</MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!form.fecha || !form.paciente_id}
        >
          Confirmar Turno
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TurnoForm;

/* import { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthContext } from '../context/AuthContext';

// IMPORTANTE: Importar configuración de idioma para Argentina
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 

// Configurar dayjs en español
dayjs.locale('es');

const TurnoForm = ({ profesionalExterno, onSuccess }) => {
  const { usuario } = useContext(AuthContext);

  const [form, setForm] = useState({
    dni_paciente: '',
    paciente_id: '',
    profesional_id: '',
    recepcionista_id: '',
    fecha: '',
    estado: 'PENDIENTE'
  });

  const [nombreProfesional, setNombreProfesional] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [diasLaborales, setDiasLaborales] = useState([]);
  const [nombrePaciente, setNombrePaciente] = useState('');

  useEffect(() => {
    if (profesionalExterno) {
      setForm(prev => ({ ...prev, profesional_id: profesionalExterno.id }));
      setNombreProfesional(profesionalExterno.Usuario?.nombre || 'Médico');
    }
  }, [profesionalExterno]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (form.dni_paciente.length >= 7) {
        try {
          const res = await api.get(`/pacientes/buscar?dni=${form.dni_paciente}`);
          setNombrePaciente(`✅ ${res.data.nombre}`);
          setForm(prev => ({ ...prev, paciente_id: res.data.id }));
        } catch (err) {
          setNombrePaciente('❌ No encontrado');
          setForm(prev => ({ ...prev, paciente_id: '' }));
        }
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [form.dni_paciente]);

  useEffect(() => {
    if (form.profesional_id) {
      api.get(`/agenda/profesional/${form.profesional_id}`).then(res => {
        const mapeo = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
        setDiasLaborales(res.data.map(i => mapeo[i.dia_semana]));
      });
    }
  }, [form.profesional_id]);

  useEffect(() => {
    if (form.profesional_id && fechaSeleccionada) {
      api.get(`/agenda/disponibilidad?profesional_id=${form.profesional_id}&fecha=${fechaSeleccionada.format('YYYY-MM-DD')}`)
        .then(res => setDisponibilidad(res.data.disponibles || []));
    }
  }, [form.profesional_id, fechaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recepId = usuario?.recepcionista_id;

    if (!recepId) {
      alert("Error: Tu perfil no tiene un ID de recepcionista vinculado. Por favor, cierra sesión y vuelve a entrar.");
      return;
    }

    const payload = { ...form, recepcionista_id: recepId };

    try {
      await api.post('/turnos', payload);
      alert("✅ Turno creado con éxito");
      onSuccess?.();
      setForm(prev => ({ ...prev, dni_paciente: '', paciente_id: '', fecha: '' }));
      setFechaSeleccionada(null);
      setNombrePaciente('');
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Error de servidor"}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
        <TextField
          label="DNI del Paciente"
          value={form.dni_paciente}
          onChange={(e) => setForm({ ...form, dni_paciente: e.target.value })}
          helperText={nombrePaciente}
          required
          fullWidth
        />
        <TextField label="Profesional" value={nombreProfesional} InputProps={{ readOnly: true }} variant="filled" fullWidth />
        
        <DatePicker
          label="Fecha del Turno"
          value={fechaSeleccionada}
          onChange={(val) => setFechaSeleccionada(val)}
          // MODIFICACIÓN 1: Bloquea días pasados
          disablePast
          // MODIFICACIÓN 2: Formato Argentino
          format="DD/MM/YYYY"
          shouldDisableDate={(date) => diasLaborales.length > 0 && !diasLaborales.includes(date.day())}
          slotProps={{ 
            textField: { 
              fullWidth: true, 
              required: true,
              helperText: "Día/Mes/Año"
            } 
          }}
        />

        <TextField
          select
          label="Horario Disponible"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          disabled={!disponibilidad.length}
          required
          fullWidth
        >
          {disponibilidad.map((d, index) => (
            <MenuItem key={index} value={d.fecha}>{d.hora} hs</MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!form.fecha || !form.paciente_id}
        >
          Confirmar Turno
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TurnoForm; */

/* import { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, MenuItem, Typography } from '@mui/material';
import api from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthContext } from '../context/AuthContext';

const TurnoForm = ({ profesionalExterno, onSuccess }) => {
  const { usuario } = useContext(AuthContext); // Obtenemos el usuario del contexto

  const [form, setForm] = useState({
    dni_paciente: '',
    paciente_id: '',
    profesional_id: '',
    recepcionista_id: '',
    fecha: '',
    estado: 'PENDIENTE'
  });

  const [nombreProfesional, setNombreProfesional] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [diasLaborales, setDiasLaborales] = useState([]);
  const [nombrePaciente, setNombrePaciente] = useState('');

  // Sincronizar profesional elegido
  useEffect(() => {
    if (profesionalExterno) {
      setForm(prev => ({ ...prev, profesional_id: profesionalExterno.id }));
      setNombreProfesional(profesionalExterno.Usuario?.nombre || 'Médico');
    }
  }, [profesionalExterno]);

  // Buscar paciente por DNI
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (form.dni_paciente.length >= 7) {
        try {
          const res = await api.get(`/pacientes/buscar?dni=${form.dni_paciente}`);
          setNombrePaciente(`✅ ${res.data.nombre}`);
          setForm(prev => ({ ...prev, paciente_id: res.data.id }));
        } catch (err) {
          setNombrePaciente('❌ No encontrado');
          setForm(prev => ({ ...prev, paciente_id: '' }));
        }
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [form.dni_paciente]);

  // Cargar disponibilidad
  useEffect(() => {
    if (form.profesional_id) {
      api.get(`/agenda/profesional/${form.profesional_id}`).then(res => {
        const mapeo = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
        setDiasLaborales(res.data.map(i => mapeo[i.dia_semana]));
      });
    }
  }, [form.profesional_id]);

  useEffect(() => {
    if (form.profesional_id && fechaSeleccionada) {
      api.get(`/agenda/disponibilidad?profesional_id=${form.profesional_id}&fecha=${fechaSeleccionada.format('YYYY-MM-DD')}`)
        .then(res => setDisponibilidad(res.data.disponibles || []));
    }
  }, [form.profesional_id, fechaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // LEEMOS EL ID DIRECTAMENTE DEL CONTEXTO
    const recepId = usuario?.recepcionista_id;

    if (!recepId) {
      alert("Error: Tu perfil no tiene un ID de recepcionista vinculado. Por favor, cierra sesión y vuelve a entrar.");
      return;
    }

    const payload = { ...form, recepcionista_id: recepId };

    try {
      await api.post('/turnos', payload);
      alert("✅ Turno creado con éxito");
      onSuccess?.();
      // Limpiar campos
      setForm(prev => ({ ...prev, dni_paciente: '', paciente_id: '', fecha: '' }));
      setFechaSeleccionada(null);
      setNombrePaciente('');
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Error de servidor"}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>
        <TextField
          label="DNI del Paciente"
          value={form.dni_paciente}
          onChange={(e) => setForm({ ...form, dni_paciente: e.target.value })}
          helperText={nombrePaciente}
          required
          fullWidth
        />
        <TextField label="Profesional" value={nombreProfesional} InputProps={{ readOnly: true }} variant="filled" fullWidth />
        <DatePicker
          label="Fecha del Turno"
          value={fechaSeleccionada}
          onChange={(val) => setFechaSeleccionada(val)}
          shouldDisableDate={(date) => diasLaborales.length > 0 && !diasLaborales.includes(date.day())}
          slotProps={{ textField: { fullWidth: true, required: true } }}
        />
        <TextField
          select
          label="Horario Disponible"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          disabled={!disponibilidad.length}
          required
          fullWidth
        >
          {disponibilidad.map((d, index) => (
            <MenuItem key={index} value={d.fecha}>{d.hora} hs</MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!form.fecha || !form.paciente_id}
        >
          Confirmar Turno
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TurnoForm; */
