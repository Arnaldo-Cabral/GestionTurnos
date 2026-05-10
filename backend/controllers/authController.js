const Usuario = require('../models/Usuario');
const Profesional = require('../models/Profesional');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hashedPassword, rol });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // 🛡️ NUEVA VALIDACIÓN DE ESTADO ACTIVO
    if (!usuario.activo) {
      return res.status(403).json({ 
        error: 'Tu cuenta está desactivada. Contacta al administrador.' 
      });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // --- NUEVA LÓGICA PARA PROFESIONALES ---
    let profesional_id = null;
    if (usuario.rol === 'PROFESIONAL') {
      const prof = await Profesional.findOne({ where: { usuario_id: usuario.id } });
      if (prof) {
        profesional_id = prof.id;
      }
    }
    // ---------------------------------------

    const token = jwt.sign(
      { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        rol: usuario.rol,
        profesional_id: profesional_id // 👈 Agregamos el ID al token también
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Devolvemos el usuario con el profesional_id incluido
    res.json({ 
      token, 
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        profesional_id: profesional_id // 👈 Esto es lo que React estaba esperando
      } 
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: error.message });
  }
};