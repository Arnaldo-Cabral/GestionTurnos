const { Op } = require('sequelize');
const sequelize = require('../config/db');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista');
const Usuario = require('../models/Usuario');
const HistoriaClinica = require('../models/HistoriaClinica');

// ====================================================================
// CREATE: Crear un nuevo turno (Busca paciente por DNI y mapea recepcionista)
// ====================================================================
exports.create = async (req, res) => {
  try {
    const { dni_paciente, profesional_id, recepcionista_id, fecha, estado = 'PENDIENTE' } = req.body;

    // 1. Buscar al paciente por DNI
    const paciente = await Paciente.findOne({ where: { dni: dni_paciente } });
    if (!paciente) {
      return res.status(404).json({ error: `No se encontró ningún paciente con el DNI: ${dni_paciente}` });
    }

    // 2. Validar profesional
    const profesionalExiste = await Profesional.findByPk(profesional_id);
    if (!profesionalExiste || profesionalExiste.activo === false) {
      return res.status(403).json({ error: 'Profesional no encontrado o no habilitado.' });
    }

    // 3. Buscar al recepcionista (por su ID de usuario que viene del token/front)
    let recepcionistaReal = await Recepcionista.findOne({ where: { usuario_id: recepcionista_id } });
    if (!recepcionistaReal) {
      recepcionistaReal = await Recepcionista.findByPk(recepcionista_id);
    }

    if (!recepcionistaReal) {
      return res.status(404).json({ error: "Perfil de recepcionista no encontrado." });
    }

    // 4. Validar duplicados de horario
    const turnoExistente = await Turno.findOne({ where: { profesional_id, fecha: fecha } });
    if (turnoExistente) {
      return res.status(400).json({ error: 'Ese horario ya está ocupado.' });
    }

    // 5. Crear el turno
    const nuevoTurno = await Turno.create({
      paciente_id: paciente.id,
      profesional_id,
      recepcionista_id: recepcionistaReal.id,
      fecha: fecha,
      estado: estado
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error("❌ Error al crear turno:", error);
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// READ: Obtener todos los turnos
// ====================================================================
exports.getAll = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        { model: Paciente, attributes: ['id', 'nombre', 'dni', 'telefono'] },
        {
          model: Profesional,
          attributes: ['id', 'especialidad'],
          include: [{ model: Usuario, attributes: ['nombre'] }]
        },
        {
          model: Recepcionista,
          attributes: ['id'],
          include: [{ model: Usuario, attributes: ['nombre'] }]
        }
      ]
    });
    res.json(turnos);
  } catch (error) {
    console.error("❌ Error al obtener turnos:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    // Si viene fecha, la convertimos a objeto Date
    if (req.body.fecha) req.body.fecha = new Date(req.body.fecha);

    await turno.update(req.body);
    res.json(turno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ====================================================================
// UPDATE ESTADO: Actualizar solo el estado
// ====================================================================
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estadosValidos = ['PENDIENTE', 'REALIZADO', 'CANCELADO'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido.' });
    }

    const turno = await Turno.findByPk(id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    turno.estado = estado;
    await turno.save();
    res.json({ mensaje: 'Estado actualizado', turno });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// ATENDER TURNO (Historia Clínica)
// ====================================================================
exports.atenderTurno = async (req, res) => {
  const { id } = req.params;
  const { diagnostico, tratamiento, observaciones } = req.body;

  try {
    await sequelize.transaction(async (t) => {
      await HistoriaClinica.create({
        turno_id: id,
        diagnostico,
        tratamiento,
        observaciones
      }, { transaction: t });

      const turno = await Turno.findByPk(id);
      turno.estado = 'REALIZADO';
      await turno.save({ transaction: t });
    });
    res.json({ mensaje: 'Atención registrada.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... (El resto de tus funciones getPendientesPorProfesional, getHistorialPaciente y remove se mantienen igual pero asegúrate de que estén dentro del módulo)

exports.remove = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
    await turno.destroy();
    res.json({ mensaje: 'Turno eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendientesPorProfesional = async (req, res) => {
  try {
    const { profesional_id } = req.params;
    const hoyInicio = new Date(); hoyInicio.setHours(0, 0, 0, 0);
    const hoyFin = new Date(); hoyFin.setHours(23, 59, 59, 999);

    const turnos = await Turno.findAll({
      where: { profesional_id, estado: 'PENDIENTE', fecha: { [Op.between]: [hoyInicio, hoyFin] } },
      include: [{ model: Paciente, attributes: ['id', 'nombre', 'dni', 'telefono', 'obra_social', 'fecha_nacimiento'] }],
      order: [['fecha', 'ASC']]
    });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistorialPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;
    const turnos = await Turno.findAll({ where: { paciente_id }, attributes: ['id'], raw: true });
    if (!turnos || turnos.length === 0) return res.json([]);

    const idsTurnos = turnos.map(t => t.id);
    const historial = await HistoriaClinica.findAll({
      where: { turno_id: idsTurnos },
      include: [{
        model: Turno,
        include: [{ model: Profesional, include: [{ model: Usuario, attributes: ['nombre'] }] }]
      }],
      order: [['id', 'DESC']]
    });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* const { Op } = require('sequelize');
const sequelize = require('../config/db');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista');
const Usuario = require('../models/Usuario');
const HistoriaClinica = require('../models/HistoriaClinica');

// ====================================================================
// CREATE: Crear un nuevo turno
// ====================================================================
exports.create = async (req, res) => {
  try {
    const { paciente_id, profesional_id, recepcionista_id, fecha } = req.body;

    // Validación de datos mínimos
    if (!paciente_id || !recepcionista_id || !profesional_id || !fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios para crear el turno." });
    }

    const nuevoTurno = await Turno.create({
      paciente_id,
      profesional_id,
      recepcionista_id,
      fecha,
      estado: 'PENDIENTE'
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({ error: error.message });
  }
};

try {
  // 1. Buscar al paciente por DNI
  const paciente = await Paciente.findOne({ where: { dni: dni_paciente } });
  if (!paciente) {
    return res.status(404).json({ error: `No se encontró ningún paciente con el DNI: ${dni_paciente}` });
  }

  const profesionalExiste = await Profesional.findByPk(profesional_id);
  if (!profesionalExiste || profesionalExiste.activo === false) {
    return res.status(403).json({ error: 'Profesional no encontrado o no habilitado.' });
  }

  // 2. Buscar al recepcionista (por su ID de usuario que viene del token/front)
  let recepcionistaReal = await Recepcionista.findOne({ where: { usuario_id: recepcionista_id } });
  if (!recepcionistaReal) {
    recepcionistaReal = await Recepcionista.findByPk(recepcionista_id);
  }

  if (!recepcionistaReal) {
    return res.status(404).json({ error: "Perfil de recepcionista no encontrado." });
  }

  // 3. Validar duplicados
  const turnoExistente = await Turno.findOne({ where: { profesional_id, fecha: fecha } });
  if (turnoExistente) {
    return res.status(400).json({ error: 'Ese horario ya está ocupado.' });
  }

  // 4. Crear el turno usando el ID del paciente que encontramos por DNI
  const nuevoTurno = await Turno.create({
    paciente_id: paciente.id,
    profesional_id,
    recepcionista_id: recepcionistaReal.id,
    fecha: fecha,
    estado
  });

  res.status(201).json(nuevoTurno);
} catch (error) {
  console.error("❌ Error al crear turno:", error);
  res.status(500).json({ error: error.message });
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
// PENDIENTES POR PROFESIONAL
// ====================================================================
exports.getPendientesPorProfesional = async (req, res) => {
  try {
    const { profesional_id } = req.params;

    // Obtenemos el inicio y fin del día actual (00:00:00 a 23:59:59)
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const turnos = await Turno.findAll({
      where: {
        profesional_id,
        estado: 'PENDIENTE',
        fecha: {
          [Op.between]: [hoyInicio, hoyFin] // 👈 Filtro para ver solo HOY
        }
      },
      attributes: ['id', 'fecha', 'estado'],
      include: [
        {
          model: Paciente,
          attributes: ['id', 'nombre', 'dni', 'telefono', 'obra_social', 'fecha_nacimiento'] // 👈 Agregamos campos para la ficha
        }
      ],
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
    console.log("🔍 TIPO DE DATO paciente_id:", typeof paciente_id, "VALOR:", paciente_id);

    // 1. Buscamos manualmente todos los IDs de turnos que pertenecen a ese paciente
    const turnos = await Turno.findAll({
      where: { paciente_id: paciente_id },
      attributes: ['id'],
      raw: true // Esto nos devuelve un array simple de objetos
    });

    if (!turnos || turnos.length === 0) {
      console.log("⚠️ No se encontraron turnos para este paciente.");
      return res.json([]);
    }

    const idsTurnos = turnos.map(t => t.id);
    console.log("🔍 PASO 2: IDs de turnos encontrados:", idsTurnos);

    // 2. Buscamos las historias clínicas que correspondan a esos IDs de turnos
    const historial = await HistoriaClinica.findAll({
      where: {
        turno_id: idsTurnos // Sequelize usará un "WHERE turno_id IN (...)"
      },
      include: [
        {
          model: Turno,
          include: [{
            model: Profesional,
            include: [{ model: Usuario, attributes: ['nombre'] }]
          }]
        }
      ],
      order: [['id', 'DESC']]
    });

    console.log(`✅ PASO 3: Historias encontradas: ${historial.length}`);
    res.json(historial);

  } catch (error) {
    console.error("❌ Error Crítico en el Historial:", error);
    res.status(500).json({ error: error.message });
  }
};
 */