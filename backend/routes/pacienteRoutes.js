const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, pacienteController.getAll);
router.post('/', verifyToken, pacienteController.create);
router.put('/:id', verifyToken, pacienteController.update);
router.delete('/:id', verifyToken, pacienteController.remove);

module.exports = router;
