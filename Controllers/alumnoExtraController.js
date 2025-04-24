const pool = require('../config/db');
const Alumno = require('../models/alumno.model');

const registrarAlumno = async (req, res) => {
    try{
        const nuevoAlumno = req.body;

        const result = await pool.query(
            'INSERT INTO alumnos(idusuario, nombre, apellidopaterno, apellidomaterno, numerocontrol, semestre) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [
                nuevoAlumno.idUsuario,
                nuevoAlumno.nombre,
                nuevoAlumno.apellidoPaterno,
                nuevoAlumno.apellidoMaterno,
                nuevoAlumno.numeroControl,
                nuevoAlumno.semestre
            ]
        );

        await Alumno.create({
            idUsuario: nuevoAlumno.idUsuario,
            nombre: nuevoAlumno.nombre,
            apellidoPaterno: nuevoAlumno.apellidoPaterno,
            apellidoMaterno: nuevoAlumno.apellidoMaterno,
            numeroControl: nuevoAlumno.numeroControl,
            semestre: Number(nuevoAlumno.semestre)
        });

        res.status(200).json({ mensaje: 'Alumno registrado correctamente'});
    } catch (error) {
        if (error.code === '23505'){
            return res.status(400).json({mensaje: 'Numero de control ya registrado'});
        }
        console.error('Error exacto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor', detalle: error.message });
    }
};

module.exports = { registrarAlumno };
