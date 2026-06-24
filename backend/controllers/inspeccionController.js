const connection = require("../database/connection");

// Obtener todas las inspecciones
const obtenerInspecciones = (req, res) => {

    const sql = "SELECT * FROM inspecciones";

    connection.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al obtener inspecciones"
            });
        }

        res.status(200).json(results);

    });

};

// Obtener inspección por ID
const obtenerInspeccionPorId = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM inspecciones
        WHERE id_inspeccion = ?
    `;

    connection.query(sql, [id], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar inspección"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                mensaje: "Inspección no encontrada"
            });
        }

        res.status(200).json(results[0]);

    });

};

// Obtener inspecciones de un activo
const obtenerInspeccionesPorActivo = (req, res) => {

    const { id_activo } = req.params;

    const sql = `
        SELECT *
        FROM inspecciones
        WHERE id_activo = ?
    `;

    connection.query(sql, [id_activo], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar inspecciones del activo"
            });
        }

        res.status(200).json(results);

    });

};

// Crear inspección
const crearInspeccion = (req, res) => {

    const {
        id_activo,
        id_tecnico,
        tipo_inspeccion,
        observaciones,
        resultado,
        estado
    } = req.body;

    const sql = `
        INSERT INTO inspecciones (
            id_activo,
            id_tecnico,
            tipo_inspeccion,
            observaciones,
            resultado,
            estado
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            id_activo,
            id_tecnico,
            tipo_inspeccion,
            observaciones,
            resultado,
            estado
        ],
        (error, results) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al registrar inspección"
                });
            }

            res.status(201).json({
                mensaje: "Inspección registrada correctamente",
                id_inspeccion: results.insertId
            });

        }
    );

};

module.exports = {
    obtenerInspecciones,
    obtenerInspeccionPorId,
    obtenerInspeccionesPorActivo,
    crearInspeccion
};