const Plant = require('../models/Plant');

exports.createPlant = async (req, res) => {
    try {
        // 1. Extraemos también 'image' del cuerpo de la petición
        const { name, species, wateringFrequency, lastWatered, image } = req.body;

        const newPlant = new Plant({
            name,
            species,
            wateringFrequency,
            lastWatered,
            image, // 2. Guardamos el string de la imagen en la base de datos
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

exports.deletePlant = async (req, res) => {
    try {
        let plant = await Plant.findById(req.params.id);

        if (!plant) {
            return res.status(404).json({ msg: 'Planta no encontrada' });
        }

        if (plant.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await Plant.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Planta eliminada correctamente' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor al eliminar');
    }
};

// Confirmar que se ha regado hoy o actualizar la fecha de riego
exports.updateWatering = async (req, res) => {
    try {
        const { lastWatered } = req.body;
        let plant = await Plant.findById(req.params.id);

        if (!plant) return res.status(404).json({ msg: 'Planta no encontrada' });
        if (plant.user.toString() !== req.user.id) return res.status(401).json({ msg: 'No autorizado' });

        plant.lastWatered = lastWatered || new Date(); // Si no viene fecha, pone la de hoy
        await plant.save();
        
        res.json(plant);
    } catch (err) {
        res.status(500).send('Error al actualizar el riego');
    }
};