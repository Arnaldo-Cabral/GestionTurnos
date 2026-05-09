const { Usuario, Recepcionista, Profesional } = require('../models');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      // attributes: { exclude: ['password'] }, // Por seguridad
      include: [{
        model: Profesional,
        // Esto trae especialidad, matricula e intervalo
      }]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // 1. Extraemos los datos
    const { nombre, email, password, rol, activo, especialidad, matricula, intervalo } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // --- SECCIÓN SEGURIDAD: CONTRASEÑA ---
    // Solo actualizamos la contraseña si el usuario escribió algo en ese campo
    if (password && password.trim() !== "") {
      usuario.password = await bcrypt.hash(password, 10);
    }

    // --- SECCIÓN USUARIO ---
    // Actualizamos solo si los valores existen, si no, mantenemos los actuales
    usuario.nombre = nombre?.trim() || usuario.nombre;
    usuario.email = email?.trim() || usuario.email;
    usuario.rol = rol || usuario.rol;
    usuario.activo = activo !== undefined ? activo : usuario.activo;

    await usuario.save();

    // --- SECCIÓN PROFESIONAL ---
    if (rol === 'PROFESIONAL') {
      const profesional = await Profesional.findOne({ where: { usuario_id: usuario.id } });

      if (profesional) {
        await profesional.update({
          // Si el admin mandó algo nuevo (trim), lo usamos. 
          // Si mandó vacío o nada, dejamos lo que ya estaba en la DB.
          especialidad: (especialidad && especialidad.trim() !== "") ? especialidad.trim() : profesional.especialidad,
          matricula: (matricula && matricula.trim() !== "") ? matricula.trim() : profesional.matricula,
          intervalo: (intervalo !== undefined && intervalo !== "") ? parseInt(intervalo, 10) : profesional.intervalo
        });
      }
    }


    // --- SECCIÓN RESPUESTA SEGURA ---
    // Al devolver el resultado, eliminamos la contraseña por seguridad
    const resultado = await Usuario.findByPk(usuario.id, {
      include: [{ model: Profesional }],
      attributes: { exclude: ['password'] } // 👈 Nunca enviamos el hash al front
    });

    res.json(resultado);
  } catch (error) {
    console.error("Error al actualizar:", error);
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
    // 1. Capturamos el intervalo del body 👈 NUEVO
    const { nombre, email, password, rol, especialidad, matricula, intervalo } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre: nombre.trim(),
      email: email.trim(),
      password: hashedPassword,
      rol
    });

    if (rol === 'RECEPCIONISTA') {
      await Recepcionista.create({ usuario_id: nuevoUsuario.id });
    }

    if (rol === 'PROFESIONAL') {
      await Profesional.create({
        usuario_id: nuevoUsuario.id,
        especialidad: especialidad.trim(),
        matricula: matricula.trim(),
        // Usamos el intervalo que viene del body o el default de la DB (20)
        intervalo: intervalo ? parseInt(intervalo, 10) : 20
      });
    }

    // Importante: Devolver el usuario con el modelo Profesional incluido 
    // para que el Front vea el intervalo inmediatamente.
    const usuarioCreado = await Usuario.findByPk(nuevoUsuario.id, {
      include: [{ model: Profesional }]
    });

    res.status(201).json(usuarioCreado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};