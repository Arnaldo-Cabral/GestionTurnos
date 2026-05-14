const dayjs = require('dayjs'); // 👈 AGREGA ESTO
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

    // 1. Obtener el profesional para usar su INTERVALO
    const profesional = await Profesional.findByPk(profesional_id);
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    const intervalo = profesional.intervalo || 20; // Default por si acaso

    // 2. Determinar el día de la semana (Lunes, Martes...)
    // Usamos 'en-US' para obtener el nombre y luego mapearlo o forzarlo a lo que espera el ENUM
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaSemanaNombre = dias[dayjs(fecha).day()];

    // 3. Buscar bloques de agenda para ese día
    const bloques = await Agenda.findAll({
      where: { profesional_id, activo: true, dia_semana: diaSemanaNombre }
    });

    // 4. Buscar turnos ya ocupados ese día
    const turnosOcupados = await Turno.findAll({
      where: { 
        profesional_id, 
        fecha: { [Op.startsWith]: fecha },
        estado: { [Op.ne]: 'CANCELADO' } // No contar los cancelados como ocupados
      }
    });

    // Formatear ocupados a HH:mm
    const horasOcupadas = turnosOcupados.map(t => dayjs(t.fecha).format('HH:mm'));

    const disponibles = [];

    for (const bloque of bloques) {
      let inicio = dayjs(`${fecha} ${bloque.hora_inicio}`);
      const fin = dayjs(`${fecha} ${bloque.hora_fin}`);

      while (inicio.isBefore(fin)) {
        const horaActual = inicio.format('HH:mm');

        if (!horasOcupadas.includes(horaActual)) {
          disponibles.push({
            dia: diaSemanaNombre,
            hora: horaActual,
            fecha: inicio.format('YYYY-MM-DDTHH:mm:ss') // Formato ISO para la DB
          });
        }
        inicio = inicio.add(intervalo, 'minute');
      }
    }

    res.json({ fecha, disponibles, intervalo_usado: intervalo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};