const { Op } = require('sequelize');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista');
const Usuario = require('../models/Usuario'); // 👈 IMPORTANTE: Necesario para el nombre del médico

// ====================================================================
// CREATE: Crear un nuevo turno
// ====================================================================
exports.create = async (req, res) => {
  const { paciente_id, profesional_id, fecha, estado = 'PENDIENTE', recepcionista_id } = req.body;

  console.log("--- 🔍 INICIO CREATE TURNO ---");

  if (!paciente_id || !profesional_id || !fecha || !recepcionista_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const pacienteExiste = await Paciente.findByPk(paciente_id);
    if (!pacienteExiste) return res.status(404).json({ error: `Paciente ID ${paciente_id} no encontrado.` });

    const profesionalExiste = await Profesional.findByPk(profesional_id);
    if (!profesionalExiste) return res.status(404).json({ error: `Profesional ID ${profesional_id} no encontrado.` });

    let recepcionistaReal = await Recepcionista.findOne({ where: { usuario_id: recepcionista_id } });
    if (!recepcionistaReal) {
      recepcionistaReal = await Recepcionista.findByPk(recepcionista_id);
    }
    if (!recepcionistaReal) {
      return res.status(404).json({
        error: `El usuario ID ${recepcionista_id} no tiene un perfil de Recepcionista asociado.`
      });
    }

    const fechaObj = new Date(fecha);
    const turnoExistente = await Turno.findOne({ where: { profesional_id, fecha: fechaObj } });
    if (turnoExistente) {
      return res.status(400).json({ error: 'Ese horario ya está ocupado por otro turno.' });
    }

    const nuevoTurno = await Turno.create({
      paciente_id,
      profesional_id,
      recepcionista_id: recepcionistaReal.id,
      fecha: fechaObj,
      estado
    });

    console.log("🎉 Turno creado con éxito ID:", nuevoTurno.id);
    res.status(201).json(nuevoTurno);

  } catch (error) {
    console.error("❌ Error al crear turno:", error);
    res.status(400).json({ error: error.message || 'Error al procesar el turno.' });
  }
};

// ====================================================================
// READ: Obtener todos los turnos con relaciones anidadas
// ====================================================================
exports.getAll = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        {
          model: Paciente,
          attributes: ['id', 'nombre', 'dni', 'telefono']
        },
        {
          model: Profesional,
          attributes: ['id', 'especialidad'],
          include: [
            { model: Usuario, attributes: ['nombre'] }
          ]
        },
        {
          model: Recepcionista,
          attributes: ['id'],
          include: [
            { model: Usuario, attributes: ['nombre'] }
          ]
        }
      ]
    });

    res.json(turnos);
  } catch (error) {
    console.error("❌ Error al obtener turnos:", error);
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// UPDATE: Actualizar un turno completo
// ====================================================================
exports.update = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    if (req.body.fecha) req.body.fecha = new Date(req.body.fecha);

    await turno.update(req.body);
    res.json(turno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ====================================================================
// UPDATE ESTADO: Actualizar solo el estado del turno
// ====================================================================
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['PENDIENTE', 'REALIZADO', 'CANCELADO'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Valores permitidos: PENDIENTE, CONFIRMADO, CANCELADO.' });
    }

    const turno = await Turno.findByPk(id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    turno.estado = estado;
    await turno.save();

    res.json({ mensaje: 'Estado actualizado correctamente', turno });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// REMOVE: Eliminar un turno
// ====================================================================
exports.remove = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    await turno.destroy();
    res.json({ mensaje: 'Turno eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// DISPONIBILIDAD
// ====================================================================
exports.getDisponibilidad = async (req, res) => {
  try {
    const { profesional_id, fecha } = req.query;

    if (!profesional_id || !fecha) {
      return res.status(400).json({ error: 'Faltan parámetros: profesional_id y fecha.' });
    }

    const inicioDia = new Date(`${fecha}T00:00:00`);
    const finDia = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        profesional_id,
        fecha: { [Op.between]: [inicioDia, finDia] },
        estado: { [Op.not]: 'CANCELADO' }
      }
    });

    const ocupados = turnos.map(t => t.fecha);
    res.json({ fecha, ocupados });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// PENDIENTES POR PROFESIONAL
// ====================================================================
exports.getPendientesPorProfesional = async (req, res) => {
  try {
    const { profesional_id } = req.params;
    const turnos = await Turno.findAll({
      where: { profesional_id, estado: 'PENDIENTE' },
      include: [{ model: Paciente, attributes: ['nombre', 'dni', 'telefono'] }],
      order: [['fecha', 'ASC']]
    });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};