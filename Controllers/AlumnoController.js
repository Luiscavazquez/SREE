const { pool } = require('../config/db');

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

        // Si no existe la tabla Alumno_Clase, créala
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Alumno_Clase (
                Id SERIAL PRIMARY KEY,
                IdAlumno INT REFERENCES Alumno(IdA),
                IdClase INT REFERENCES Clase(IdClase)
            )
        `);

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

module.exports = {
    asignarAlumnoAClase
};
