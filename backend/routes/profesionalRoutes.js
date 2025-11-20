const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');
const { verifyToken, isAdmin, checkRole } = require('../middlewares/auth');

router.get('/', verifyToken, profesionalController.getAll);
router.post('/', verifyToken, isAdmin, profesionalController.create);
router.put('/:id', verifyToken, isAdmin, profesionalController.update);
router.delete('/:id', verifyToken, isAdmin, profesionalController.remove);

// Nuevos endpoints para los profesionales
router.get('/especialidades', verifyToken, checkRole(['RECEPCIONISTA']), profesionalController.getEspecialidades);
router.get('/especialidad/:esp', verifyToken, checkRole(['RECEPCIONISTA']), profesionalController.getByEspecialidad);

//****lo comente para probar si funciona** */
//Para poder listar los profesionales en el front
/* router.get('/especialidad/:esp', verifyToken, checkRole(['RECEPCIONISTA']), async (req, res) => {
  const { esp } = req.params;
  try {
    const profesionales = await Profesional.findAll({
      where: { especialidad: esp },
      include: [{ model: Usuario, attributes: ['nombre'] }]
    });
    res.json(profesionales); // Devuelve nombre, id, especialidad
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

module.exports = router;
