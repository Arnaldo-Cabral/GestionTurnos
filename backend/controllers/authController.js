const Usuario = require('../models/Usuario');
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

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' });
    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
