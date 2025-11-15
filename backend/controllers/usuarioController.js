const { Usuario, Recepcionista, Profesional } = require('../models');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, email, password, rol, activo, especialidad, matricula } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Actualizar contraseña si se envía
    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    // Actualizar datos generales
    Object.assign(usuario, { nombre, email, rol, activo });
    await usuario.save();

    // Actualizar datos extendidos si es profesional
    if (rol === 'PROFESIONAL') {
      let profesional = await Profesional.findOne({ where: { usuario_id: usuario.id } });

      if (profesional) {
        profesional.especialidad = especialidad || profesional.especialidad;
        profesional.matricula = matricula || profesional.matricula;
        await profesional.save();
      } else {
        await Profesional.create({
          usuario_id: usuario.id,
          especialidad,
          matricula
        });
      }
    }

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, email, password, rol, especialidad, matricula } = req.body;

    // Validación básica
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario base
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    // Insertar en tabla específica según el rol
    if (rol === 'RECEPCIONISTA') {
      await Recepcionista.create({ usuario_id: nuevoUsuario.id });
    }

    if (rol === 'PROFESIONAL') {
      if (!especialidad || !matricula) {
        return res.status(400).json({ error: 'Faltan especialidad o matrícula para profesional' });
      }
      await Profesional.create({
        usuario_id: nuevoUsuario.id,
        especialidad,
        matricula
      });
    }

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

