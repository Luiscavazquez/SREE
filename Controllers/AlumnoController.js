const { pool } = require('../config/db');

// Asignar alumno a clase
const asignarAlumnoAClase = async (req, res) => {
    const { idAlumno, idClase } = req.body;

    try {
        // Verifica si el alumno ya está asignado a la clase (opcional)
        const existe = await pool.query(
            'SELECT * FROM Alumno_Clase WHERE IdAlumno = $1 AND IdClase = $2',
            [idAlumno, idClase]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ message: 'El alumno ya está asignado a esta clase.' });
        }

        // Insertar la relación alumno-clase
        await pool.query(
            'INSERT INTO Alumno_Clase (IdAlumno, IdClase) VALUES ($1, $2)',
            [idAlumno, idClase]
        );

        res.status(201).json({ message: 'Alumno asignado correctamente a la clase.' });
    } catch (error) {
        console.error('Error asignando alumno a clase:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Seleccionar materia (vincular alumno a clase)
const seleccionarMateria = async (req, res) => {
    const { idAlumno, idClase } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO Alumno_Clase (IdAlumno, IdClase)
             VALUES ($1, $2)
             ON CONFLICT (IdAlumno, IdClase) DO NOTHING
             RETURNING *;`,
            [idAlumno, idClase]
        );

        if (result.rows.length === 0) {
            return res.status(409).json({ message: 'La materia ya fue seleccionada por este alumno' });
        }

        res.status(201).json({
            message: 'Materia seleccionada exitosamente',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Exportar ambas funciones
module.exports = {
    asignarAlumnoAClase,
    seleccionarMateria
};
