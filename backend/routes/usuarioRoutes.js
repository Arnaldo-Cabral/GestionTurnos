const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', verifyToken, isAdmin, usuarioController.getAll);
router.post('/', verifyToken, isAdmin, usuarioController.create); 
router.put('/:id', verifyToken, isAdmin, usuarioController.update);
router.delete('/:id', verifyToken, isAdmin, usuarioController.remove);

module.exports = router;