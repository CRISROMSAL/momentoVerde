const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
// Aumentamos el límite a 10 megas para que quepan las fotos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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