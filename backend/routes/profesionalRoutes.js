const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', verifyToken, profesionalController.getAll);
router.post('/', verifyToken, isAdmin, profesionalController.create);
router.put('/:id', verifyToken, isAdmin, profesionalController.update);
router.delete('/:id', verifyToken, isAdmin, profesionalController.remove);

module.exports = router;
