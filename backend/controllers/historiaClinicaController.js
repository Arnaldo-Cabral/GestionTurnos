const { Op } = require('sequelize');
//const HistoriaClinica = require('../models/HistoriaClinica');
const { HistoriaClinica, Turno, Paciente, Profesional, Usuario } = require('../models');
/* const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario'); */

// Nuevo método para buscar historial por DNI o Nombre del paciente
exports.getByPaciente = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) return res.json([]);

    const historias = await HistoriaClinica.findAll({
      include: [{
        model: Turno,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            where: {
              [Op.or]: [
                { dni: { [Op.like]: `%${query}%` } },
                { nombre: { [Op.like]: `%${query}%` } }
              ]
            }
          },
          {
            model: Profesional,
            required: false,
            include: [{ 
                model: Usuario, 
                attributes: ['nombre'] // Aquí es donde sale el nombre del médico
            }] 
          }
        ]
      }],
      order: [['fecha_registro', 'DESC']]
    });
    
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* exports.getByPaciente = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) return res.json([]);

    const historias = await HistoriaClinica.findAll({
      include: [{
        model: Turno,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            where: {
              [Op.or]: [
                { dni: { [Op.like]: `%${query}%` } },
                { nombre: { [Op.like]: `%${query}%` } }
              ]
            }
          },
          {
            model: Profesional,
            required: false, // Usamos false para que si no hay profesional, igual traiga la historia
            include: [{ 
                model: Usuario, 
                attributes: ['nombre'] 
            }] 
          }
        ]
      }],
      order: [['fecha_registro', 'DESC']]
    });
    
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */

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

// Al final de tus otros métodos en historiaClinicaController.js
exports.getAll = async (req, res) => {
  try {
    const historias = await HistoriaClinica.findAll({
      include: [{
        model: Turno,
        include: [Paciente]
      }]
    });
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
