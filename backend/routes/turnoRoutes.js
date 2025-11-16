const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Solo RECEPCIONISTA puede gestionar turnos para mas seguridad se pone el Role
router.get('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.getAll);
router.post('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.create);
router.put('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.update);
router.delete('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.remove);

//ESto es para consultar disponibilidad del profesional
const { Op } = require('sequelize');

router.get('/disponibilidad', verifyToken, checkRole(['RECEPCIONISTA']), async (req, res) => {
  const { profesional_id, fecha } = req.query;
  try {
    const turnos = await Turno.findAll({
      where: {
        profesional_id,
        fecha: {
          [Op.startsWith]: fecha // o usar BETWEEN para rango horario
        },
        estado: { [Op.not]: 'CANCELADO' }
      }
    });
    res.json(turnos); // Devuelve horarios ocupados
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;