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

// Importar y usar rutas correctamente
const asistenciaRoutes = require('./routes/asistenciaRoutes');
app.use('/asistencia', asistenciaRoutes);

const materiaRoutes = require('./routes/materiaRoutes');
app.use('/api/materias', materiaRoutes);

const claseRoutes = require('./routes/claseRoutes');
app.use('/api/clases', claseRoutes);

const alumnoRoutes = require('./routes/alumnoRoutes');
app.use('/api/alumnos', alumnoRoutes);

// rutas adrian
const authRoutes = require('./routes/auth.routes');
app.use('/api/registro', authRoutes);
const alumnosRoutes = require('./routes/alumno.routes');
app.use('/api/registro', alumnosRoutes);
const maestroRoutes = require('./routes/maestro.routes');
app.use('/api/registro', maestroRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
