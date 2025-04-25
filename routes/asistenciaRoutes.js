const express = require('express');
const router = express.Router();
const AsistenciaController = require('../Controllers/AsistenciaController');

// Ruta de prueba
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// RUTAS DE APIS NO BORRAR O EDITAR.
router.post('/', AsistenciaController.registrarAsistencia);
router.get('/:numeroControl', AsistenciaController.verAsistenciasPorNumeroControl);

// NUEVA RUTA: Descargar PDF de asistencias de un maestro
router.get('/pdf/maestro/:idMaestro', AsistenciaController.enviarAsistenciasPDF);

module.exports = router;
