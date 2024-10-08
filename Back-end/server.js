const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');  // Importar las rutas de notas
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Para parsear JSON

// Conectar a MongoDB
mongoose.connect('mongodb+srv://santiago23:5RH65WP3Dc3DCCcT@cluster0.aq9nr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log('Error conectando a MongoDB', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', noteRoutes);  // Usar las rutas de notas

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});






