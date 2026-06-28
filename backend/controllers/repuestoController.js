const connection = require("../database/connection");
const obtenerRepuestos = (req, res) => {

    const sql = "SELECT * FROM repuestos";

    connection.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al obtener repuestos"
            });
        }

        res.status(200).json(results);

    });

};
const crearRepuesto = (req, res) => {

    const {
        codigo,
        nombre,
        descripcion,
        fabricante,
        stock_actual,
        stock_minimo,
        unidad_medida
    } = req.body;

    const sql = `
        INSERT INTO repuestos (
            codigo,
            nombre,
            descripcion,
            fabricante,
            stock_actual,
            stock_minimo,
            unidad_medida
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            codigo,
            nombre,
            descripcion,
            fabricante,
            stock_actual,
            stock_minimo,
            unidad_medida
        ],
        (error, results) => {

            if (error) {
                console.error("Error detallado de MySQL:", error);
                return res.status(500).json({
                    mensaje: "Error al registrar repuesto",
                    error: error.message
                });
            }

            res.status(201).json({
                mensaje: "Repuesto registrado correctamente",
                id_repuesto: results.insertId
            });

        }
    );

};
module.exports = {
    obtenerRepuestos,
    crearRepuesto
};