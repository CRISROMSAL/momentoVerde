const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const auth = require('../middleware/auth'); // Importamos tu middleware de seguridad

// Todas estas rutas están protegidas por 'auth'
router.post('/', auth, plantController.createPlant);
router.get('/', auth, plantController.getPlants);
router.delete('/:id', auth, plantController.deletePlant);

// Ruta para eliminar: DELETE /api/plants/:id
router.delete('/:id', auth, plantController.deletePlant);
router.put('/:id/water', auth, plantController.updateWatering);

module.exports = router;