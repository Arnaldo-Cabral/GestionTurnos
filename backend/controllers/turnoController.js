const { Op } = require('sequelize');
const sequelize = require('../config/db'); // 👈 AGREGÁ ESTA LÍNEA (verificá que la ruta sea correcta)
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista');
const Usuario = require('../models/Usuario'); // 👈 IMPORTANTE: Necesario para el nombre del médico
const HistoriaClinica = require('../models/HistoriaClinica'); // para menejar el turno

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

// ====================================================================
// CONTROLA LOS TURNOS DEL PROFESIONAL
// ====================================================================

exports.atenderTurno = async (req, res) => {
  const { id } = req.params; // ID del turno
  const { diagnostico, tratamiento, observaciones } = req.body;

  try {
    // Usamos una transacción para que se hagan ambas cosas o ninguna
    await sequelize.transaction(async (t) => {
      // 1. Crear la historia clínica
      await HistoriaClinica.create({
        turno_id: id,
        diagnostico,
        tratamiento,
        observaciones
      }, { transaction: t });

      // 2. Actualizar el estado del turno
      const turno = await Turno.findByPk(id);
      turno.estado = 'REALIZADO';
      await turno.save({ transaction: t });
    });

    res.json({ mensaje: 'Atención registrada y turno finalizado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la atención: ' + error.message });
  }
};
// ====================================================================
// OBTENER HISTORIAL COMPLETO DE UN PACIENTE
// ====================================================================
exports.getHistorialPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;
    
    // 1. Buscamos los turnos (Usamos el nombre de columna 'id' que está en tu SQL)
    const turnosDelPaciente = await Turno.findAll({
      where: { paciente_id },
      attributes: ['id']
    });

    if (turnosDelPaciente.length === 0) {
      return res.json([]);
    }

    const idsTurnos = turnosDelPaciente.map(t => t.id);

    // 2. Buscamos las historias clínicas
    const historial = await HistoriaClinica.findAll({
      where: {
        turno_id: { [Op.in]: idsTurnos }
      },
      include: [
        { 
          model: Turno, 
          required: false, // Evita que se rompa por las múltiples constraints del SQL
          include: [{ 
            model: Profesional, 
            include: [{ model: Usuario, attributes: ['nombre'] }] 
          }] 
        }
      ],
      // CAMBIO CLAVE: Usamos 'id' o 'fecha_registro' porque 'createdAt' NO existe en tu SQL
      order: [['id', 'DESC']] 
    });

    console.log(`🔎 Paciente ${paciente_id}: ${historial.length} registros encontrados.`);
    res.json(historial);
  } catch (error) {
    console.error("❌ Error detallado en el Backend:", error);
    res.status(500).json({ error: 'Error en la consulta: ' + error.message });
  }
};