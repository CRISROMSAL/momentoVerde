const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Esto permite que el servidor entienda datos en formato JSON

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/plants', plantRoutes);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado con éxito a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('El servidor de Momento Verde está funcionando');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});