/* const { Op, fn, col } = require('sequelize'); */
const { Op } = require('sequelize');
const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');
const Turno = require('../models/Turno');


// Normaliza el día de la semana al formato del ENUM (ej: "martes" → "Martes")
function normalizarDia(dia) {
  if (!dia) return '';
  const lower = dia.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Crear un bloque de agenda (solo PROFESIONAL)
 * Body: { dia_semana, hora_inicio, hora_fin }
 */
exports.create = async (req, res) => {
  try {
    const { dia_semana, hora_inicio, hora_fin } = req.body;
    const usuario_id = req.user.id;

    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const nuevaAgenda = await Agenda.create({
      profesional_id: profesional.id,
      dia_semana: normalizarDia(dia_semana), // normalizamos siempre
      hora_inicio,
      hora_fin,
      activo: true
    });

    res.status(201).json(nuevaAgenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Listar agendas del profesional autenticado (solo PROFESIONAL)
 */
exports.getOwn = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    // Buscamos al profesional por su usuario_id
    const profesional = await Profesional.findOne({ where: { usuario_id } });

    if (!profesional) {
      return res.status(404).json({ error: 'Perfil profesional no encontrado para este usuario' });
    }

    // Buscamos TODOS los bloques de este profesional
    const agendas = await Agenda.findAll({
      where: { profesional_id: profesional.id },
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
    });

    // IMPORTANTE: Enviamos el JSON
    res.json(agendas);
  } catch (error) {
    console.error("Error en getOwn:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Actualizar un bloque de agenda (solo PROFESIONAL)
 * Params: { id }
 * Body: puede incluir dia_semana, hora_inicio, hora_fin, activo
 */
exports.update = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const agenda = await Agenda.findOne({
      where: { id: req.params.id, profesional_id: profesional.id }
    });
    if (!agenda) return res.status(404).json({ error: 'Agenda no encontrada' });

    // Normalizamos si se actualiza el día
    if (req.body.dia_semana) {
      req.body.dia_semana = normalizarDia(req.body.dia_semana);
    }

    await agenda.update(req.body);
    res.json(agenda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Eliminar un bloque de agenda (solo PROFESIONAL)
 * Params: { id }
 */
exports.remove = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const agenda = await Agenda.findOne({
      where: { id: req.params.id, profesional_id: profesional.id }
    });
    if (!agenda) return res.status(404).json({ error: 'Agenda no encontrada' });

    await agenda.destroy();
    res.json({ mensaje: 'Agenda eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener agenda de un profesional por ID (solo RECEPCIONISTA)
 * Params: { id }
 */
exports.getByProfesional = async (req, res) => {
  try {
    const profesional_id = req.params.id;
    const agenda = await Agenda.findAll({
      where: { profesional_id, activo: true },
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']]
    });
    res.json(agenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Normaliza el día de la semana al formato del ENUM (ej: "martes" → "Martes")
function normalizarDia(dia) {
  if (!dia) return '';
  const lower = dia.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Obtener disponibilidad de un profesional en una fecha (solo RECEPCIONISTA)
 * Query: { profesional_id, fecha: 'YYYY-MM-DD' }
 * Devuelve: { fecha, disponibles: [{ dia, hora, fecha }] }
 */
exports.getDisponibilidad = async (req, res) => {
  try {
    const { profesional_id, fecha } = req.query;

    if (!profesional_id || !fecha) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    // 1. Obtener el intervalo real de la DB
    const profesional = await Profesional.findByPk(profesional_id);
    const intervalo = profesional ? profesional.intervalo : 20;

    // 2. Normalizar día
    const fechaObj = new Date(fecha + 'T12:00:00'); // Forzamos mediodía para evitar errores de zona horaria
    const diaSemana = fechaObj.toLocaleDateString('es-AR', { weekday: 'long' });
    const diaNormalizado = normalizarDia(diaSemana);

    // 3. Buscar agenda
    const bloques = await Agenda.findAll({
      where: { profesional_id, activo: true, dia_semana: diaNormalizado }
    });

    // 4. Turnos ocupados
    const turnos = await Turno.findAll({
      where: { profesional_id, fecha: { [Op.startsWith]: fecha } }
    });

    // Formateamos ocupados a "HH:mm" para comparar exacto
    const ocupados = turnos.map(t => {
      const d = new Date(t.fecha);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    });

    const disponibles = [];

    for (const bloque of bloques) {
      // IMPORTANTE: MySQL devuelve "09:00:00". Usamos split para evitar errores de Date
      const [startH, startM] = bloque.hora_inicio.split(':');
      const [endH, endM] = bloque.hora_fin.split(':');

      let actual = new Date(fechaObj);
      actual.setHours(parseInt(startH), parseInt(startM), 0);

      let fin = new Date(fechaObj);
      fin.setHours(parseInt(endH), parseInt(endM), 0);

      // BUCLE DE GENERACIÓN POR INTERVALO
      while (actual < fin) {
        const hh = actual.getHours().toString().padStart(2, '0');
        const mm = actual.getMinutes().toString().padStart(2, '0');
        const horaStr = `${hh}:${mm}`;

        if (!ocupados.includes(horaStr)) {
          disponibles.push({
            dia: bloque.dia_semana,
            hora: horaStr,
            fecha: `${fecha}T${horaStr}:00`
          });
        }

        // SUMAMOS EL INTERVALO (15, 20, 14 min...) 👈 ESTA ES LA CLAVE
        actual.setMinutes(actual.getMinutes() + intervalo);
      }
    }

    res.json({ fecha, disponibles, intervalo_usado: intervalo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/* exports.getDisponibilidad = async (req, res) => {
  try {
    const { profesional_id, fecha } = req.query;

    if (!profesional_id || !fecha) {
      return res.status(400).json({ error: 'Faltan parámetros: profesional_id y fecha' });
    }

    // Día de la semana (localizado) de la fecha seleccionada
    const diaSemana = new Date(fecha).toLocaleDateString('es-AR', { weekday: 'long' });
    const diaNormalizado = normalizarDia(diaSemana);

    // 1) Bloques de agenda activos para ese día (comparación insensible a mayúsculas)
    const pid = Number(profesional_id);
    const agenda = await Agenda.findAll({
      where: {
        profesional_id: pid,
        activo: true,
        dia_semana: fn('LOWER', col('dia_semana')), // columna en minúscula
      },
      order: [['hora_inicio', 'ASC']]
    });

    // Filtramos manualmente por coincidencia insensible
    const agendaFiltrada = agenda.filter(a => a.dia_semana.toLowerCase() === diaNormalizado.toLowerCase());

    if (!agendaFiltrada || agendaFiltrada.length === 0) {
      return res.json({ fecha, disponibles: [] });
    }

    // 2) Turnos ocupados en esa fecha
    const turnos = await Turno.findAll({ where: { profesional_id: pid } });
    const fechaBase = new Date(fecha).toDateString();
    const ocupadosHoras = turnos
      .filter(t => new Date(t.fecha).toDateString() === fechaBase)
      .map(t => new Date(t.fecha).getHours());

    // 3) Generar slots libres a intervalos de 60 minutos
    const disponibles = [];
    for (const bloque of agendaFiltrada) {
      const [hIni] = bloque.hora_inicio.split(':').map(n => parseInt(n, 10));
      const [hFin] = bloque.hora_fin.split(':').map(n => parseInt(n, 10));

      
      for (let h = hIni; h < hFin; h++) {
        if (!ocupadosHoras.includes(h)) {
          const horaStr = `${h.toString().padStart(2, '0')}:00`;
          const fechaCompleta = `${fecha}T${horaStr}:00`;

          disponibles.push({
            dia: bloque.dia_semana,
            hora: horaStr,
            fecha: fechaCompleta
          });
        }
      }
    }

    console.log("Slots generados:", disponibles);

    res.json({ fecha, disponibles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */