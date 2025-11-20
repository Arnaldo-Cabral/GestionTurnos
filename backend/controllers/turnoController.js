const { Op } = require('sequelize');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista');

// ====================================================================
// CREATE: Crear un nuevo turno (Con resolución de ID de Recepcionista)
// ====================================================================
exports.create = async (req, res) => {
  // 'recepcionista_id' viene del frontend con el valor del ID de USUARIO (ej. 36)
  const { paciente_id, profesional_id, fecha, estado = 'PENDIENTE', recepcionista_id } = req.body;

  console.log("--- 🔍 INICIO CREATE TURNO ---");
  console.log("Datos recibidos:", { paciente_id, profesional_id, recepcionista_id, fecha });

  if (!paciente_id || !profesional_id || !fecha || !recepcionista_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    // 1. Verificar Paciente
    const pacienteExiste = await Paciente.findByPk(paciente_id);
    if (!pacienteExiste) {
        return res.status(404).json({ error: `Paciente ID ${paciente_id} no encontrado.` });
    }

    // 2. Verificar Profesional
    const profesionalExiste = await Profesional.findByPk(profesional_id);
    if (!profesionalExiste) {
        return res.status(404).json({ error: `Profesional ID ${profesional_id} no encontrado.` });
    }

    // 3. BUSCAR AL RECEPCIONISTA REAL
    // Intentamos buscar en la tabla Recepcionista alguien que tenga este usuario_id
    let recepcionistaReal = await Recepcionista.findOne({ where: { usuario_id: recepcionista_id } });

    // Si no lo encontramos por usuario_id, probamos si nos enviaron el ID directo (por si acaso)
    if (!recepcionistaReal) {
        console.log(`⚠️ No se encontró por usuario_id=${recepcionista_id}, probando por PK directa...`);
        recepcionistaReal = await Recepcionista.findByPk(recepcionista_id);
    }

    if (!recepcionistaReal) {
        console.error(`❌ Error: No existe perfil de Recepcionista para el usuario/id ${recepcionista_id}`);
        return res.status(404).json({ 
            error: `El usuario ID ${recepcionista_id} no tiene un perfil de Recepcionista asociado.` 
        });
    }

    console.log(`✅ Recepcionista encontrado: ID Tabla=${recepcionistaReal.id} (Usuario ID=${recepcionistaReal.usuario_id})`);

    // 4. Validar disponibilidad (evitar duplicados)
    const fechaObj = new Date(fecha); 
    const turnoExistente = await Turno.findOne({ where: { profesional_id, fecha: fechaObj } });
    
    if (turnoExistente) {
      return res.status(400).json({ error: 'Ese horario ya está ocupado por otro turno.' });
    }

    // 5. Crear turno usando el ID REAL de la tabla Recepcionista
    const nuevoTurno = await Turno.create({
      paciente_id,
      profesional_id,
      recepcionista_id: recepcionistaReal.id, // 👈 Aquí usamos el ID correcto (ej. 1, 2...)
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
// READ: Obtener todos los turnos
// ====================================================================
exports.getAll = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        { model: Paciente, attributes: ['id', 'nombre', 'dni', 'telefono'] },
        { model: Profesional, attributes: ['id', 'nombre', 'especialidad'] },
        { model: Recepcionista, attributes: ['id', 'nombre'] }
      ]
    });
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// UPDATE: Actualizar un turno
// ====================================================================
exports.update = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });

    if (req.body.fecha) {
      req.body.fecha = new Date(req.body.fecha);
    }

    await turno.update(req.body);
    res.json(turno);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
// PENDIENTES
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