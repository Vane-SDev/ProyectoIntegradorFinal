const connection = require("../database/connection");

const obtenerIntervenciones = (req, res) => {

    const sql = "SELECT * FROM intervenciones";

    connection.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al obtener intervenciones"
            });
        }

        res.status(200).json(results);

    });

};

const crearIntervencion = (req, res) => {

    const {
        id_ot,
        id_activo,
        id_tecnico,
        fecha_fin,
        trabajo_realizado,
        observaciones,
        tiempo_empleado,
        resultado
    } = req.body;

    const sql = `
        INSERT INTO intervenciones (
            id_ot,
            id_activo,
            id_tecnico,
            fecha_fin,
            trabajo_realizado,
            observaciones,
            tiempo_empleado,
            resultado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            id_ot,
            id_activo,
            id_tecnico,
            fecha_fin,
            trabajo_realizado,
            observaciones,
            tiempo_empleado,
            resultado
        ],
        (error, results) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al registrar intervención"
                });
            }

            res.status(201).json({
                mensaje: "Intervención registrada correctamente",
                id_intervencion: results.insertId
            });

        }
    );


};

const obtenerIntervencionesPorActivo = (req, res) => {

    const { id_activo } = req.params;

    const sql = `
        SELECT *
        FROM intervenciones
        WHERE id_activo = ?
    `;

    connection.query(sql, [id_activo], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar intervenciones del activo"
            });
        }

        res.status(200).json(results);

    });

};
const obtenerIntervencionesPorOT = (req, res) => {

    const { id_ot } = req.params;

    const sql = `
        SELECT *
        FROM intervenciones
        WHERE id_ot = ?
    `;

    connection.query(sql, [id_ot], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar intervenciones de la orden"
            });
        }

        res.status(200).json(results);

    });

};

module.exports = {
    obtenerIntervenciones,
    crearIntervencion,
    obtenerIntervencionesPorActivo,
    obtenerIntervencionesPorOT
};