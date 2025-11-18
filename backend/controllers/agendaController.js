const Agenda = require('../models/Agenda');
const Profesional = require('../models/Profesional');

// Crear un bloque de agenda (solo PROFESIONAL)
exports.create = async (req, res) => {
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
};

// Listar agendas del profesional autenticado
exports.getOwn = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const profesional = await Profesional.findOne({ where: { usuario_id } });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    const agendas = await Agenda.findAll({ where: { profesional_id: profesional.id } });
    res.json(agendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un bloque de agenda
exports.update = async (req, res) => {
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
};

// Eliminar un bloque de agenda
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

// Obtener agenda de un profesional por ID (solo RECEPCIONISTA)
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
