/* const Profesional = require('../models/Profesional');

exports.getAll = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll();
    res.json(profesionales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const profesional = await Profesional.create(req.body);
    res.status(201).json(profesional);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id);
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    await profesional.update(req.body);
    res.json(profesional);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id);
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    await profesional.destroy();
    res.json({ mensaje: 'Profesional eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */

const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario'); // <-- NECESARIO para la doble inserción
const bcrypt = require('bcrypt'); // <-- NECESARIO para hashear la contraseña

// ====================================================================
// CREATE: CREAR USUARIO Y PROFESIONAL (Requiere Rol ADMIN)
// ====================================================================

exports.create = async (req, res) => {
    // 1. Extraemos datos comunes (Usuario) y específicos (Profesional)
    const { nombre, email, password, especialidad, matricula } = req.body;
    const rolAsignado = 'PROFESIONAL'; 

    if (!nombre || !email || !password || !especialidad || !matricula) {
        return res.status(400).json({ error: 'Faltan campos obligatorios para crear el profesional.' });
    }

    try {
        // 2. Hashing de la Contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // =========================================================
        // PASO 1: CREAR EL REGISTRO EN LA TABLA USUARIOS (LOGIN)
        // =========================================================
        const nuevoUsuario = await Usuario.create({
            nombre: nombre,
            email: email,
            password: hashedPassword,
            rol: rolAsignado,
            activo: true
        });

        // =========================================================
        // PASO 2: CREAR EL REGISTRO EN LA TABLA PROFESIONALES (ROL)
        // =========================================================
        const nuevoProfesional = await Profesional.create({
            usuario_id: nuevoUsuario.id, // <-- Relacionamos con el ID del usuario
            especialidad: especialidad,
            matricula: matricula
        });

        // 3. Respuesta de éxito
        res.status(201).json({ 
            mensaje: 'Profesional creado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            },
            profesional_id: nuevoProfesional.id
        });

    } catch (error) {
        // Manejar errores (ej: email duplicado, validación de Sequelize)
        console.error("Error al crear profesional:", error);
        res.status(400).json({ error: error.message || 'Fallo en la creación del profesional.' });
    }
};

// ====================================================================
// READ: Obtener todos
// ====================================================================

exports.getAll = async (req, res) => {
    try {
        const profesionales = await Profesional.findAll(
            // Considera incluir el modelo Usuario aquí para obtener nombre y email
            // { include: [{ model: Usuario, attributes: ['nombre', 'email'] }] } 
        );
        res.json(profesionales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ====================================================================
// UPDATE
// ====================================================================

exports.update = async (req, res) => {
    try {
        const profesional = await Profesional.findByPk(req.params.id);
        if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

        // Nota: Si se requiere actualizar nombre/email, se debe actualizar también el modelo Usuario
        await profesional.update(req.body); 
        res.json(profesional);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ====================================================================
// REMOVE
// ====================================================================

exports.remove = async (req, res) => {
    try {
        const profesional = await Profesional.findByPk(req.params.id);
        if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

        // Recomendación: Si eliminas el profesional, también debes eliminar el usuario asociado para mantener la integridad.
        // const usuarioId = profesional.usuario_id; 

        await profesional.destroy(); // Elimina de profesionales

        // await Usuario.destroy({ where: { id: usuarioId } }); // <-- Descomentar si quieres eliminar el usuario principal

        res.json({ mensaje: 'Profesional eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};