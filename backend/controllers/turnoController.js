/* const Turno = require('../models/Turno');

exports.getAll = async (req, res) => {
  try {
    const turnos = await Turno.findAll();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const turno = await Turno.create(req.body);
    res.status(201).json(turno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
    await turno.update(req.body);
    res.json(turno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
 */

const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');     
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista'); // <-- Necesario para obtener el ID

// ====================================================================
// CREATE: CREAR UN NUEVO TURNO
// ====================================================================

exports.create = async (req, res) => {
    // 1. Desestructuración de datos
    const { paciente_id, profesional_id, fecha, estado = 'PENDIENTE', recepcionista_id } = req.body;
    
    // **NOTA DE SEGURIDAD:** Es mejor obtener el recepcionista_id desde el token, 
    // pero por ahora lo dejamos en req.body para hacer la prueba inicial.
    
    if (!paciente_id || !profesional_id || !fecha || !recepcionista_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: paciente_id, profesional_id, fecha y recepcionista_id.' });
    }

    try {
        // =========================================================
        // PASO 1: VERIFICAR LA EXISTENCIA DE LLAVES FORÁNEAS (Integridad de datos)
        // =========================================================

        // 1.1 Verificar Paciente
        const pacienteExiste = await Paciente.findByPk(paciente_id);
        if (!pacienteExiste) {
            return res.status(404).json({ error: `Paciente con ID ${paciente_id} no encontrado.` });
        }

        // 1.2 Verificar Profesional
        const profesionalExiste = await Profesional.findByPk(profesional_id);
        if (!profesionalExiste) {
            return res.status(404).json({ error: `Profesional con ID ${profesional_id} no encontrado.` });
        }
        
        // 1.3 Verificar Recepcionista
        const recepcionistaExiste = await Recepcionista.findByPk(recepcionista_id);
        if (!recepcionistaExiste) {
            return res.status(404).json({ error: `Recepcionista con ID ${recepcionista_id} no encontrado.` });
        }


        // =========================================================
        // PASO 2: CREAR EL TURNO
        // =========================================================
        const nuevoTurno = await Turno.create({
            paciente_id,
            profesional_id,
            recepcionista_id,
            fecha,
            estado
        });

        // 3. Respuesta de éxito
        res.status(201).json(nuevoTurno);

    } catch (error) {
        console.error("Error al crear turno:", error);
        // El error puede ser por formato de fecha incorrecto o cualquier otro problema SQL/Sequelize
        res.status(400).json({ error: error.message || 'Error al procesar la creación del turno.' });
    }
};

// ====================================================================
// READ: Obtener todos
// ====================================================================

exports.getAll = async (req, res) => {
    try {
        // NOTA: Se recomienda usar 'include' para traer datos de Paciente y Profesional
        const turnos = await Turno.findAll();
        res.json(turnos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ====================================================================
// UPDATE
// ====================================================================

exports.update = async (req, res) => {
    try {
        const turno = await Turno.findByPk(req.params.id);
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
        
        // Implementar validaciones similares a create si se actualizan IDs foráneos
        await turno.update(req.body);
        res.json(turno);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ====================================================================
// REMOVE
// ====================================================================

exports.remove = async (req, res) => {
    try {
        const turno = await Turno.findByPk(req.params.id);
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' });
        
        await turno.destroy();
        res.json({ mensaje: 'Turno eliminado' });
    } catch (error) {
        // Manejar error de llave foránea si el turno está relacionado con Historia Clínica
        res.status(500).json({ error: error.message });
    }
};