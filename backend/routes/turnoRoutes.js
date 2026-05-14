const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// GET ALL
router.get('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.getAll);

// CREATE
router.post('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.create);

// UPDATE (Línea 12 - Aquí estaba el error)
// Asegúrate de que turnoController.update exista en el archivo del controlador
router.put('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.update);

// DELETE
router.delete('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.remove);

// ESTADO
router.put('/:id/estado', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.updateEstado);

// PROFESIONALES
router.get('/pendientes/:profesional_id', verifyToken, checkRole(['PROFESIONAL']), turnoController.getPendientesPorProfesional);
router.post('/:id/atender', verifyToken, checkRole(['PROFESIONAL']), turnoController.atenderTurno);
router.get('/paciente/:paciente_id/historial', verifyToken, checkRole(['PROFESIONAL']), turnoController.getHistorialPaciente);

module.exports = router;

/* const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// CRUD de turnos (solo recepcionista)
router.get('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.getAll);

// Ruta POST simplificada para evitar errores de sintaxis
router.post('/', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.create);

router.put('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.update);
router.delete('/:id', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.remove);

// Cambio de estado
router.put('/:id/estado', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.updateEstado);

// Rutas para Profesionales
router.get('/pendientes/:profesional_id', verifyToken, checkRole(['PROFESIONAL']), turnoController.getPendientesPorProfesional);
router.post('/:id/atender', verifyToken, checkRole(['PROFESIONAL']), turnoController.atenderTurno);
router.get('/paciente/:paciente_id/historial', verifyToken, checkRole(['PROFESIONAL']), turnoController.getHistorialPaciente);

module.exports = router; */

/* const express = require('express');
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
/* === CON ESTO CAMBIO EL ESTADO DEL TURNO PENDIENTE CONFIRMADO CANELADO === 
router.put('/:id/estado', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.updateEstado);

// ... el resto de tus rutas siguen igual
/* router.get('/disponibilidad', verifyToken, checkRole(['RECEPCIONISTA']), turnoController.getDisponibilidad); 
router.get('/pendientes/:profesional_id', verifyToken, checkRole(['PROFESIONAL']), turnoController.getPendientesPorProfesional);

// Ruta para que el profesional atienda el turno
router.post('/:id/atender', verifyToken, checkRole(['PROFESIONAL']), turnoController.atenderTurno);

// Ruta para ver historial completo del paciente
router.get('/paciente/:paciente_id/historial', verifyToken, checkRole(['PROFESIONAL']), turnoController.getHistorialPaciente);

module.exports = router; */