/* const Recepcionista = require('../models/Recepcionista');

exports.getAll = async (req, res) => {
  try {
    const recepcionistas = await Recepcionista.findAll();
    res.json(recepcionistas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const recepcionista = await Recepcionista.create(req.body);
    res.status(201).json(recepcionista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const recepcionista = await Recepcionista.findByPk(req.params.id);
    if (!recepcionista) return res.status(404).json({ error: 'Recepcionista no encontrado' });
    await recepcionista.update(req.body);
    res.json(recepcionista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const recepcionista = await Recepcionista.findByPk(req.params.id);
    if (!recepcionista) return res.status(404).json({ error: 'Recepcionista no encontrado' });
    await recepcionista.destroy();
    res.json({ mensaje: 'Recepcionista eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */


const Recepcionista = require('../models/Recepcionista');
const Usuario = require('../models/Usuario'); // <-- IMPORTACIÓN CLAVE: El modelo de Usuario
const bcrypt = require('bcrypt'); // <-- IMPORTACIÓN CLAVE: Para hashear la contraseña

// ====================================================================
// CREATE: CREAR USUARIO Y RELACIÓN (REQUIERE ROL ADMIN)
// ====================================================================

exports.create = async (req, res) => {
  // 1. Desestructuración de datos de entrada
  const { nombre, email, password } = req.body;
  const rolAsignado = 'RECEPCIONISTA';

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email y password.' });
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
      password: hashedPassword, // Guardamos el hash
      rol: rolAsignado,
      activo: true
      // Sequelize automáticamente agregará createdAt/updatedAt
    });

    // =========================================================
    // PASO 2: CREAR EL REGISTRO EN LA TABLA RECEPCIONISTAS (ROL)
    // =========================================================
    const nuevaRecepcionista = await Recepcionista.create({
      usuario_id: nuevoUsuario.id // <-- Relación: Usamos el ID del usuario recién creado
      // Sequelize automáticamente agregará createdAt/updatedAt
    });

    // 3. Respuesta de éxito
    res.status(201).json({
      mensaje: 'Recepcionista creado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      },
      recepcionista_id: nuevaRecepcionista.id
    });

  } catch (error) {
    // Manejar errores como email duplicado (UNIQUE en la tabla usuarios)
    console.error("Error al crear recepcionista:", error);
    res.status(400).json({ error: error.message || 'Error al procesar la creación del recepcionista.' });
  }
};

// ====================================================================
// READ: Obtener todos (Debería usar JOIN para traer nombre/email)
// ====================================================================

exports.getAll = async (req, res) => {
  try {
    // Nota: Si solo haces findAll() sobre Recepcionista, solo traerás IDs.
    // Lo ideal es incluir el modelo Usuario (eager loading/JOIN)
    const recepcionistas = await Recepcionista.findAll({
      // Si tienes la asociación definida en Sequelize:
      // include: [{ model: Usuario, attributes: ['nombre', 'email', 'rol'] }]
    });
    res.json(recepcionistas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================================================================
// UPDATE, DELETE (Se dejan igual, asumiendo que solo actualizan la tabla Recepcionista)
// ====================================================================

exports.update = async (req, res) => {
  try {
    const recepcionista = await Recepcionista.findByPk(req.params.id);
    if (!recepcionista) return res.status(404).json({ error: 'Recepcionista no encontrado' });

    // Si necesitas actualizar el nombre/email, deberías usar recepcionista.usuario_id y actualizar el modelo Usuario

    await recepcionista.update(req.body); // Esto actualiza solo la tabla recepcionistas
    res.json(recepcionista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const recepcionista = await Recepcionista.findByPk(req.params.id);
    if (!recepcionista) return res.status(404).json({ error: 'Recepcionista no encontrado' });

    // Para eliminar completamente, también debes eliminar el registro asociado en la tabla usuarios:
    // const usuarioId = recepcionista.usuario_id;

    await recepcionista.destroy(); // Elimina de recepcionistas

    // await Usuario.destroy({ where: { id: usuarioId } }); // <-- Recomendado para integridad

    res.json({ mensaje: 'Recepcionista eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};