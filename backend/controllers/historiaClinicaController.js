const HistoriaClinica = require('../models/HistoriaClinica');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario');

exports.getAll = async (req, res) => {
  try {
    const historias = await HistoriaClinica.findAll({
      include: [{
        model: Turno,
        include: [
          { model: Paciente, attributes: ['nombre'] },
          {
            model: Profesional,
            include: [{ model: Usuario, attributes: ['nombre'] }]
          }
        ]
      }]
    });
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const historia = await HistoriaClinica.findByPk(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    res.json(historia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const historia = await HistoriaClinica.create(req.body);
    res.status(201).json(historia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const historia = await HistoriaClinica.findByPk(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    await historia.update(req.body);
    res.json(historia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const historia = await HistoriaClinica.findByPk(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    await historia.destroy();
    res.json({ mensaje: 'Historia clínica eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
