const { Op } = require('sequelize');
const { HistoriaClinica, Turno, Paciente, Profesional, Usuario } = require('../models');

// Nuevo método para buscar historial por DNI o Nombre del paciente
exports.getByPaciente = async (req, res) => {
  const { query } = req.query;
  const userRole = req.user?.rol;

  try {
    if (!query) return res.json([]);

    // Filtro de confidencialidad para RECEPCIONISTA
    const hcAttributes = userRole === 'RECEPCIONISTA'
      ? { exclude: ['diagnostico', 'tratamiento', 'observaciones'] }
      : { include: [] };

    const historias = await HistoriaClinica.findAll({
      attributes: hcAttributes,
      include: [{
        model: Turno,
        required: true,
        include: [
          {
            model: Paciente,
            required: true,
            // CORRECCIÓN: Quitamos 'apellido' porque no existe en la tabla pacientes
            attributes: ['nombre', 'dni'],
            where: {
              [Op.or]: [
                { dni: { [Op.like]: `%${query}%` } },
                { nombre: { [Op.like]: `%${query}%` } }
              ]
            }
          },
          {
            model: Profesional,
            required: false,
            include: [{
              model: Usuario,
              attributes: ['nombre']
            }]
          }
        ]
      }],
      order: [['fecha_registro', 'DESC']]
    });

    res.json(historias);
  } catch (error) {
    console.error("Error en getByPaciente:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  const userRole = req.user?.rol;

  try {
    const historia = await HistoriaClinica.findByPk(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia clínica no encontrada' });

    // Si es recepcionista y trata de entrar al detalle, limpiamos los datos sensibles
    if (userRole === 'RECEPCIONISTA') {
      const datosProtegidos = {
        id: historia.id,
        fecha_registro: historia.fecha_registro,
        mensaje: "Contenido confidencial: Solo accesible por profesionales médicos."
      };
      return res.json(datosProtegidos);
    }

    res.json(historia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const historia = await HistoriaClinica.create(req.body);
    res.status(201).json(historia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const historia = await HistoriaClinica.findByPk(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    await historia.update(req.body);
    res.json(historia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const historia = await HistoriaClinica.findByPk(req.params.id);
    if (!historia) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    await historia.destroy();
    res.json({ mensaje: 'Historia clínica eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Al final de tus otros métodos en historiaClinicaController.js
exports.getAll = async (req, res) => {
  try {
    const historias = await HistoriaClinica.findAll({
      include: [{
        model: Turno,
        include: [Paciente]
      }]
    });
    res.json(historias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
