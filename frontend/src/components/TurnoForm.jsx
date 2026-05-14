import { useState, useEffect, useContext } from 'react';
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

export default TurnoForm;


/* import { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import api from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TurnoForm = ({ profesionalExterno, onSuccess }) => {
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

  // 1. EFECTO DE CARGA DE SESIÓN (Independiente)
  useEffect(() => {
    const obtenerRecepcionista = async () => {
      try {
        const sesionString = localStorage.getItem('user');
        if (!sesionString) return;

        const sesion = JSON.parse(sesionString);

        // BUSQUEDA PROFUNDA: 
        // Intentamos en la raíz, y si no, dentro del objeto 'usuario'
        const rId = sesion.recepcionista_id || (sesion.usuario && sesion.usuario.recepcionista_id);

        if (rId) {
          setForm(prev => ({ ...prev, recepcionista_id: rId }));
          console.log("✅ ID de Recepcionista detectado en sesión:", rId);
        } else {
          // Si por alguna razón no está en el objeto, usamos el ID de usuario para preguntar a la API
          const userId = sesion.id || (sesion.usuario && sesion.usuario.id);
          if (userId) {
            const res = await api.get(`/recepcionistas/usuario/${userId}`);
            if (res.data && res.data.id) {
              setForm(prev => ({ ...prev, recepcionista_id: res.data.id }));
            }
          }
        }
      } catch (err) {
        console.error("Error al sincronizar perfil de recepcionista:", err);
      }
    };
    obtenerRecepcionista();
  }, []);

  // 2. SINCRONIZAR PROFESIONAL ELEGIDO
  useEffect(() => {
    if (profesionalExterno) {
      setForm(prev => ({
        ...prev,
        profesional_id: profesionalExterno.id,
        fecha: ''
      }));
      setNombreProfesional(`${profesionalExterno.Usuario?.nombre || 'Médico'} (${profesionalExterno.especialidad || ''})`);
      setFechaSeleccionada(null);
      setDisponibilidad([]);
    }
  }, [profesionalExterno]);

  // 3. BUSCAR PACIENTE POR DNI
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (form.dni_paciente.length >= 7) {
        try {
          const res = await api.get(`/pacientes/buscar?dni=${form.dni_paciente}`);
          setNombrePaciente(`✅ Paciente: ${res.data.nombre}`);
          setForm(prev => ({ ...prev, paciente_id: res.data.id }));
        } catch (err) {
          setNombrePaciente('❌ Paciente no encontrado');
          setForm(prev => ({ ...prev, paciente_id: '' }));
        }
      } else {
        setNombrePaciente('');
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [form.dni_paciente]);

  // 4. CARGAR DÍAS LABORALES
  useEffect(() => {
    if (form.profesional_id) {
      api.get(`/agenda/profesional/${form.profesional_id}`)
        .then(res => {
          const mapeo = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
          const dias = res.data.map(item => mapeo[item.dia_semana]);
          setDiasLaborales(dias);
        })
        .catch(err => console.error("Error agenda", err));
    }
  }, [form.profesional_id]);

  // 5. CARGAR HORARIOS
  useEffect(() => {
    if (form.profesional_id && fechaSeleccionada) {
      const fechaSolo = fechaSeleccionada.format('YYYY-MM-DD');
      api.get(`/agenda/disponibilidad?profesional_id=${form.profesional_id}&fecha=${fechaSolo}`)
        .then(res => setDisponibilidad(res.data.disponibles || []))
        .catch(err => console.error("Error disponibilidad", err));
    }
  }, [form.profesional_id, fechaSeleccionada]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN FINAL ANTES DE ENVIAR
    if (!form.recepcionista_id) {
      alert("Error: Tu usuario no está registrado como recepcionista en la base de datos.");
      return;
    }

    try {
      await api.post('/turnos', form);
      alert("✅ Turno creado con éxito");
      onSuccess?.();
      setForm(prev => ({ ...prev, dni_paciente: '', paciente_id: '', fecha: '' }));
      setNombrePaciente('');
      setFechaSeleccionada(null);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Error al crear turno"}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>

        <TextField
          name="dni_paciente"
          label="DNI del Paciente"
          value={form.dni_paciente}
          onChange={handleChange}
          helperText={nombrePaciente}
          FormHelperTextProps={{ sx: { color: nombrePaciente.includes('✅') ? 'green' : 'red', fontWeight: 'bold' } }}
          required
          fullWidth
        />

        <TextField
          label="Profesional Asignado"
          value={nombreProfesional}
          InputProps={{ readOnly: true }}
          variant="filled"
          fullWidth
        />

        <DatePicker
          label="1. Elegir Día"
          value={fechaSeleccionada}
          onChange={(newValue) => setFechaSeleccionada(newValue)}
          disabled={!form.profesional_id}
          shouldDisableDate={(date) => diasLaborales.length > 0 && !diasLaborales.includes(date.day())}
          slotProps={{ textField: { fullWidth: true, required: true } }}
        />

        <TextField
          select
          label="2. Elegir Hora"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          disabled={!fechaSeleccionada || disponibilidad.length === 0}
          required
          fullWidth
        >
          {disponibilidad.length > 0 ? (
            disponibilidad.map((d, index) => (
              <MenuItem key={index} value={d.fecha}>
                {d.hora} hs
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay horarios</MenuItem>
          )}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          size="large"
          // EL BOTÓN SE ACTIVA SI HAY PACIENTE Y HORA
          disabled={!form.fecha || !form.paciente_id}
          sx={{ fontWeight: 'bold', mt: 1 }}
        >
          Confirmar Turno
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TurnoForm; */

/* import { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Typography } from '@mui/material';
import api from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TurnoForm = ({ profesionalExterno, onSuccess }) => {
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

  // 1. CARGAR DATOS INICIALES (RECEPCIONISTA)
  // 1. CARGAR DATOS INICIALES (RECEPCIONISTA)
  useEffect(() => {
    const cargarDatosSesion = async () => {
      try {
        const usuarioString = localStorage.getItem('user');
        if (!usuarioString) return;

        const loggedUser = JSON.parse(usuarioString);

        // Intentamos obtener el ID de tres formas distintas para asegurar
        let rId = loggedUser.recepcionista_id ||
          (loggedUser.usuario && loggedUser.usuario.recepcionista_id) ||
          loggedUser.id_recepcionista;

        // Si después de revisar el storage NO lo tenemos, lo pedimos a la API
        if (!rId && (loggedUser.id || (loggedUser.usuario && loggedUser.usuario.id))) {
          const userId = loggedUser.id || loggedUser.usuario.id;
          try {
            const res = await api.get(`/recepcionistas/usuario/${userId}`);
            rId = res.data.id;
          } catch (err) {
            console.error("Este usuario no tiene perfil de recepcionista en la BD");
          }
        }

        if (rId) {
          setForm(prev => ({ ...prev, recepcionista_id: rId }));
        }
      } catch (error) {
        console.error("Error al cargar sesión:", error);
      }
    };

    cargarDatosSesion();
  }, []);

  // 2. SINCRONIZAR PROFESIONAL ELEGIDO
  useEffect(() => {
    if (profesionalExterno) {
      setForm(prev => ({
        ...prev,
        profesional_id: profesionalExterno.id,
        fecha: ''
      }));
      setNombreProfesional(`${profesionalExterno.Usuario?.nombre || 'Médico'} (${profesionalExterno.especialidad || ''})`);
      setFechaSeleccionada(null);
      setDisponibilidad([]);
    }
  }, [profesionalExterno]);

  // 3. BUSCAR PACIENTE POR DNI
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (form.dni_paciente.length >= 7) {
        try {
          const res = await api.get(`/pacientes/buscar?dni=${form.dni_paciente}`);
          setNombrePaciente(`✅ Paciente: ${res.data.nombre}`);
          setForm(prev => ({ ...prev, paciente_id: res.data.id }));
        } catch (err) {
          setNombrePaciente('❌ Paciente no encontrado');
          setForm(prev => ({ ...prev, paciente_id: '' }));
        }
      } else {
        setNombrePaciente('');
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [form.dni_paciente]);

  // 4. CARGAR DÍAS LABORALES
  useEffect(() => {
    if (form.profesional_id) {
      api.get(`/agenda/profesional/${form.profesional_id}`)
        .then(res => {
          const mapeo = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
          const dias = res.data.map(item => mapeo[item.dia_semana]);
          setDiasLaborales(dias);
        })
        .catch(err => console.error("Error agenda", err));
    }
  }, [form.profesional_id]);

  // 5. CARGAR HORAS DISPONIBLES
  useEffect(() => {
    if (form.profesional_id && fechaSeleccionada) {
      const fechaSolo = fechaSeleccionada.format('YYYY-MM-DD');
      api.get(`/agenda/disponibilidad?profesional_id=${form.profesional_id}&fecha=${fechaSolo}`)
        .then(res => setDisponibilidad(res.data.disponibles || []))
        .catch(err => console.error("Error disponibilidad", err));
    }
  }, [form.profesional_id, fechaSeleccionada]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/turnos', form);
      alert("✅ Turno creado con éxito");
      onSuccess?.();
      setForm(prev => ({ ...prev, dni_paciente: '', paciente_id: '', fecha: '' }));
      setNombrePaciente('');
      setFechaSeleccionada(null);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || "Error al crear turno"}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 2 }}>

        <TextField
          name="dni_paciente"
          label="DNI del Paciente"
          value={form.dni_paciente}
          onChange={handleChange}
          helperText={nombrePaciente}
          FormHelperTextProps={{ sx: { color: nombrePaciente.includes('✅') ? 'green' : 'red', fontWeight: 'bold' } }}
          required
        />

        <TextField
          label="Profesional Asignado"
          value={nombreProfesional}
          InputProps={{ readOnly: true }}
          variant="filled"
        />

        <DatePicker
          label="1. Elegir Día"
          value={fechaSeleccionada}
          onChange={(newValue) => setFechaSeleccionada(newValue)}
          disabled={!form.profesional_id}
          shouldDisableDate={(date) => diasLaborales.length > 0 && !diasLaborales.includes(date.day())}
          // Si falla, quita la línea de abajo:
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        <TextField
          select
          label="2. Elegir Hora"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          disabled={!fechaSeleccionada || disponibilidad.length === 0}
          required
        >
          {disponibilidad.length > 0 ? (
            disponibilidad.map((d, index) => (
              <MenuItem key={index} value={d.fecha}>
                {d.hora} hs
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay horarios</MenuItem>
          )}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          size="large"
          // Quitamos el requisito de recepcionista_id solo para que el botón se active
          disabled={!form.fecha || !form.paciente_id}
          sx={{ fontWeight: 'bold' }}
        >
          Confirmar Turno
        </Button>

        {/* <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!form.fecha || !form.paciente_id || !form.recepcionista_id}
          sx={{ fontWeight: 'bold' }}
        >
          Confirmar Turno
        </Button> 
      </Box>
    </LocalizationProvider>
  );
};

export default TurnoForm; */