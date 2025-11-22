const express = require('express');
const router = express.Router();
const { Agenda, Profesional, Turno } = require('../models');
const { verifyToken, checkRole } = require('../middlewares/auth');

// =======================================================
// CREATE: Profesional crea un bloque de agenda
// =======================================================
router.post('/', verifyToken, checkRole(['PROFESIONAL']), async (req, res) => {
  try {
    const { dia_semana, hora_inicio, hora_fin } = req.body;
    const usuario_id = req.user.id; // viene del token

    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const nuevaAgenda = await Agenda.create({
      profesional_id: profesional.id,
      dia_semana,
      hora_inicio,
      hora_fin
    });

    res.status(201).json(nuevaAgenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================
// READ: Listar agendas del profesional autenticado
// =======================================================
router.get('/', verifyToken, checkRole(['PROFESIONAL']), async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const agendas = await Agenda.findAll({ where: { profesional_id: profesional.id } });
    res.json(agendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================
// UPDATE: Actualizar un bloque de agenda
// =======================================================
router.put('/:id', verifyToken, checkRole(['PROFESIONAL']), async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const agenda = await Agenda.findOne({
      where: { id: req.params.id, profesional_id: profesional.id }
    });
    if (!agenda) return res.status(404).json({ error: 'Agenda no encontrada' });

    await agenda.update(req.body);
    res.json(agenda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =======================================================
// DELETE: Eliminar un bloque de agenda
// =======================================================
router.delete('/:id', verifyToken, checkRole(['PROFESIONAL']), async (req, res) => {
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
});

// =======================================================
// EXTRA: Obtener agenda de un profesional por ID (RECEPCIONISTA)
// =======================================================
router.get('/profesional/:id', verifyToken, checkRole(['RECEPCIONISTA']), async (req, res) => {
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
});

// =======================================================
// EXTRA: Obtener disponibilidad de un profesional en una fecha (RECEPCIONISTA)
// =======================================================
router.get('/disponibilidad', verifyToken, checkRole(['RECEPCIONISTA']), async (req, res) => {
  try {
    const { profesional_id, fecha } = req.query;

    if (!profesional_id || !fecha) {
      return res.status(400).json({ error: 'Faltan parámetros: profesional_id y fecha' });
    }

    // Parsear fecha como local YYYY-MM-DD
    const [year, month, day] = fecha.split("-").map(Number);
    const fechaLocal = new Date(year, month - 1, day); // <-- mes empieza en 0

    const diaSemana = fechaLocal.toLocaleDateString('es-AR', { weekday: 'long' });
    const diaNormalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1).toLowerCase();

    console.log("Fecha recibida:", fecha);
    console.log("Fecha interpretada local:", fechaLocal.toString());
    console.log("Día calculado:", diaSemana);
    console.log("Día normalizado:", diaNormalizado);

    // 1. Obtener agenda del profesional para ese día
    const agenda = await Agenda.findAll({
      where: { profesional_id, dia_semana: diaNormalizado, activo: true }
    });
    if (!agenda || agenda.length === 0) {
      return res.json({ fecha, disponibles: [] });
    }

    // 2. Obtener turnos ya ocupados en esa fecha
    const turnos = await Turno.findAll({ where: { profesional_id } });
    const ocupadosHoras = turnos
      .filter(t => new Date(t.fecha).toDateString() === new Date(fecha).toDateString())
      .map(t => new Date(t.fecha).getHours());

    // 3. Generar slots libres
    let disponibles = [];
    for (const bloque of agenda) {
      const horaInicio = parseInt(bloque.hora_inicio.split(":")[0]);
      const horaFin = parseInt(bloque.hora_fin.split(":")[0]);

      for (let h = horaInicio; h < horaFin; h++) {
        if (!ocupadosHoras.includes(h)) {
          disponibles.push({ dia: bloque.dia_semana, hora: `${h.toString().padStart(2, "0")}:00` });
        }
      }
    }

    res.json({ fecha, disponibles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;