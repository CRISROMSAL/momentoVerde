const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String },
    wateringFrequency: { type: Number, required: true },
    lastWatered: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { 
        type: String, 
        required: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);