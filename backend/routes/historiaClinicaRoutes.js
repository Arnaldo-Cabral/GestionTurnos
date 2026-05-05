const express = require('express');
const router = express.Router();
const historiaClinicaController = require('../controllers/historiaClinicaController');
//const { verifyToken, checkRole } = require('../middlewares/auth');

// RECEPCIONISTA y PROFESIONAL pueden consultar por seguridad se pone rol
router.get('/buscar', verifyToken, checkRole(['RECEPCIONISTA', 'PROFESIONAL']), historiaClinicaController.getByPaciente);
router.get('/', verifyToken, checkRole(['RECEPCIONISTA', 'PROFESIONAL']), historiaClinicaController.getAll);
router.get('/:id', verifyToken, checkRole(['RECEPCIONISTA', 'PROFESIONAL']), historiaClinicaController.getById);
// Ruta para buscar por paciente (query string: ?query=123)

// Solo PROFESIONAL puede crear, modificar y eliminar por seguridad se pone rol
router.post('/', verifyToken, checkRole(['PROFESIONAL']), historiaClinicaController.create);
router.put('/:id', verifyToken, checkRole(['PROFESIONAL']), historiaClinicaController.update);
router.delete('/:id', verifyToken, checkRole(['PROFESIONAL']), historiaClinicaController.remove);

module.exports = router;