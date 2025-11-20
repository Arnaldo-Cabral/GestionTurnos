const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// =======================================================
// CRUD de turnos (solo recepcionista)
// =======================================================

router.get('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.getAll);

// 👇 MODIFICA ESTA RUTA POST PARA AGREGAR EL DEBUG 👇
router.post('/', verifyToken, checkRole(['RECEPCIONISTA']), (req, res, next) => {
    console.log("📨 ¡Petición POST /api/turnos recibida en el Router!");
    console.log("📦 Datos del cuerpo:", req.body);
    
    // Verificamos si el controlador existe antes de llamarlo
    if (!turnoController.create) {
        console.error("❌ ERROR CRÍTICO: turnoController.create es undefined");
        return res.status(500).json({ message: "Error interno: Controlador no definido" });
    }
    
    next(); // Pasa al controlador real
}, turnoController.create);

router.put('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.update);
router.delete('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.remove);

// ... el resto de tus rutas siguen igual
router.get('/disponibilidad', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.getDisponibilidad);
router.get('/pendientes/:profesional_id', verifyToken, checkRole(['PROFESIONAL']), turnoController.getPendientesPorProfesional);

module.exports = router;