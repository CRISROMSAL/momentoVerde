const Plant = require('../models/Plant');

exports.createPlant = async (req, res) => {
    try {
        const { name, species, wateringFrequency, lastWatered } = req.body;

        const newPlant = new Plant({
            name,
            species,
            wateringFrequency,
            lastWatered,
            user: req.user.id 
        });

        const plant = await newPlant.save();
        res.json(plant);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al guardar la planta');
    }
};

exports.getPlants = async (req, res) => {
    try {
        const plants = await Plant.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(plants);
    } catch (err) {
        res.status(500).send('Error al obtener las plantas');
    }
};

// NUEVA FUNCIÓN: Eliminar una planta
exports.deletePlant = async (req, res) => {
    try {
        // 1. Buscar la planta por el ID que viene en la URL
        let plant = await Plant.findById(req.params.id);

        if (!plant) {
            return res.status(404).json({ msg: 'Planta no encontrada' });
        }

        // 2. Seguridad: Verificar que la planta pertenece al usuario del Token
        if (plant.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // 3. Eliminar
        await Plant.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Planta eliminada correctamente' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor al eliminar');
    }
};