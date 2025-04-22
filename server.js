const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, conectarMongoDB } = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
conectarMongoDB();

// Importar y usar rutas 
const asistenciaRoutes = require('./routes/asistenciaRoutes');
app.use('/', asistenciaRoutes); 

const materiaRoutes = require('./routes/materiaRoutes');
app.use('/api/materias', materiaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

const claseRoutes = require('./routes/claseRoutes');
app.use('/api/clases', claseRoutes);

const asistenciaRoutes = require('./routes/asistenciaRoutes');
app.use('/api/asistencias', asistenciaRoutes);
