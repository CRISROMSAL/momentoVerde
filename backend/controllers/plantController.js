const Plant = require('../models/Plant');

exports.createPlant = async (req, res) => {
    try {
        // Usamos los nombres que pusiste en el Modelo (name, species, wateringFrequency)
        const { name, species, wateringFrequency } = req.body;

        const newPlant = new Plant({
            name,
            species,
            wateringFrequency,
            user: req.user.id // Este ID lo saca el middleware auth.js del token
        });

        const plant = await newPlant.save();
        res.json(plant);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al guardar la planta');
    }
};

// Añadimos este para que el usuario pueda ver sus plantas después
exports.getPlants = async (req, res) => {
    try {
        const plants = await Plant.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(plants);
    } catch (err) {
        res.status(500).send('Error al obtener las plantas');
    }
};