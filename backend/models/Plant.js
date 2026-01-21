const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String },
    wateringFrequency: { type: Number, required: true }, // cada cuántos días
    lastWatered: { type: Date, required: true  },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Plant', PlantSchema);