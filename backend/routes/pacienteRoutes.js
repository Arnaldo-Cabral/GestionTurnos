const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { verifyToken, checkRole } = require('../middlewares/auth');
const Paciente = require('../models/Paciente');
/* const { Paciente } = require('../models'); */

// Solo RECEPCIONISTA puede gestionar pacientes
router.get('/', verifyToken, checkRole(['RECEPCIONISTA']), pacienteController.getAll);
router.post('/', verifyToken, checkRole(['RECEPCIONISTA']), pacienteController.create);
router.put('/:id', verifyToken, checkRole(['RECEPCIONISTA']), pacienteController.update);
router.delete('/:id', verifyToken, checkRole(['RECEPCIONISTA']), pacienteController.remove);

//Para buscar al paciente por DNI
router.get('/buscar', verifyToken, checkRole(['RECEPCIONISTA']), async (req, res) => {
  const { dni } = req.query;
  try {
    const paciente = await Paciente.findOne({ where: { dni } });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;