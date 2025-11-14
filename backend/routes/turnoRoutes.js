const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, turnoController.getAll);
router.post('/', verifyToken, turnoController.create);
router.put('/:id', verifyToken, turnoController.update);
router.delete('/:id', verifyToken, turnoController.remove);

module.exports = router;
