const express = require('express');
const router = express.Router();
const historiaClinicaController = require('../controllers/historiaClinicaController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, historiaClinicaController.getAll);
router.get('/:id', verifyToken, historiaClinicaController.getById);
router.post('/', verifyToken, historiaClinicaController.create);
router.put('/:id', verifyToken, historiaClinicaController.update);
router.delete('/:id', verifyToken, historiaClinicaController.remove);

module.exports = router;
