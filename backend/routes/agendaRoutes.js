const express = require('express');
const router = express.Router();
const { Agenda, Profesional } = require('../models');
const { verifyToken, checkRole } = require('../middlewares/auth');

// =======================================================
// CREATE: Profesional crea un bloque de agenda
// =======================================================
router.post('/', verifyToken, checkRole(['PROFESIONAL']), async (req, res) => {
  try {
    const { dia_semana, hora_inicio, hora_fin } = req.body;
    const usuario_id = req.user.id; // viene del token

    // Buscar el profesional asociado al usuario
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

module.exports = router;