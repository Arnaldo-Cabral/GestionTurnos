const Profesional = require('../models/Profesional');
const Usuario = require('../models/Usuario'); // <-- NECESARIO para la doble inserción
const bcrypt = require('bcrypt'); // <-- NECESARIO para hashear la contraseña

// ====================================================================
// CREATE: CREAR USUARIO Y PROFESIONAL (Requiere Rol ADMIN)
// ====================================================================
exports.create = async (req, res) => {
    const { nombre, email, password, especialidad, matricula } = req.body;
    const rolAsignado = 'PROFESIONAL'; 

    if (!nombre || !email || !password || !especialidad || !matricula) {
        return res.status(400).json({ error: 'Faltan campos obligatorios para crear el profesional.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // PASO 1: Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rolAsignado,
            activo: true
        });

        // PASO 2: Crear profesional vinculado al usuario
        const nuevoProfesional = await Profesional.create({
            usuario_id: nuevoUsuario.id,
            especialidad,
            matricula
        });

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
        console.error("Error al crear profesional:", error);
        res.status(400).json({ error: error.message || 'Fallo en la creación del profesional.' });
    }
};

// ====================================================================
// READ: Obtener todos
// ====================================================================
exports.getAll = async (req, res) => {
    try {
        const profesionales = await Profesional.findAll({
            include: [{ model: Usuario, attributes: ['nombre', 'email'] }]
        });
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

        await profesional.destroy();
        res.json({ mensaje: 'Profesional eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ====================================================================
// EXTRA: Obtener especialidades únicas
// ====================================================================
exports.getEspecialidades = async (req, res) => {
    try {
        const especialidades = await Profesional.findAll({
            attributes: ['especialidad'],
            group: ['especialidad']
        });
        res.json(especialidades.map(e => e.especialidad));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ====================================================================
// EXTRA: Buscar profesionales por especialidad
// ====================================================================
exports.getByEspecialidad = async (req, res) => {
    try {
        const { esp } = req.params;
        const profesionales = await Profesional.findAll({
            where: { especialidad: esp },
            include: [{ model: Usuario, attributes: ['nombre'] }]
        });
        res.json(profesionales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};