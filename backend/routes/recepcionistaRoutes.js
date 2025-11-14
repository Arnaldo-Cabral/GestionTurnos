const express = require('express');
const router = express.Router();
const recepcionistaController = require('../controllers/recepcionistaController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', verifyToken, recepcionistaController.getAll);
router.post('/', verifyToken, isAdmin, recepcionistaController.create);
router.put('/:id', verifyToken, isAdmin, recepcionistaController.update);
router.delete('/:id', verifyToken, isAdmin, recepcionistaController.remove);

module.exports = router;
