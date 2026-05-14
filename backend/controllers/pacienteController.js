const Paciente = require('../models/Paciente');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    // 👈 ORDEN ALFABÉTICO por nombre
    const pacientes = await Paciente.findAll({
      order: [['nombre', 'ASC']]
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // 👈 LIMPIEZA DE DATOS antes de guardar
    const datosLimpios = {
      nombre: req.body.nombre?.trim(),
      dni: req.body.dni?.trim(),
      fecha_nacimiento: req.body.fecha_nacimiento,
      telefono: req.body.telefono?.trim(),
      direccion: req.body.direccion?.trim(),
      obra_social: req.body.obra_social?.trim() || 'Particular' // Valor por defecto
    };

    const paciente = await Paciente.create(datosLimpios);
    res.status(201).json(paciente);
  } catch (error) {
    // 👈 MANEJO DE DNI DUPLICADO
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe un paciente registrado con ese DNI' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    // 👈 Aplicamos la misma limpieza en el Update
    const datosActualizados = {
      ...req.body,
      nombre: req.body.nombre?.trim(),
      dni: req.body.dni?.trim(),
      obra_social: req.body.obra_social?.trim() || 'Particular'
    };

    await paciente.update(datosActualizados);
    res.json(paciente);
  } catch (error) {
    // 👈 También validamos DNI duplicado al editar (por si cambian el DNI por uno existente)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ese DNI ya pertenece a otro paciente' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    await paciente.destroy();
    res.json({ mensaje: 'Paciente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// para buscar buscar el paciente por DNI en BD
exports.buscarPorDNI = async (req, res) => {
  const { dni } = req.query;
  try {
    const paciente = await Paciente.findOne({ where: { dni } });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};