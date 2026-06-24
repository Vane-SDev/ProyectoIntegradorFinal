const connection = require("../database/connection");

const registrarConsumo = (req, res) => {

    const {
        id_intervencion,
        id_repuesto,
        cantidad_utilizada
    } = req.body;

    const sqlConsumo = `
        INSERT INTO intervenciones_repuestos (
            id_intervencion,
            id_repuesto,
            cantidad_utilizada
        )
        VALUES (?, ?, ?)
    `;

    connection.query(
        sqlConsumo,
        [
            id_intervencion,
            id_repuesto,
            cantidad_utilizada
        ],
        (error, results) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al registrar consumo"
                });
            }

            const sqlStock = `
                UPDATE repuestos
                SET stock_actual = stock_actual - ?
                WHERE id_repuesto = ?
            `;

            connection.query(
                sqlStock,
                [cantidad_utilizada, id_repuesto],
                (errorStock) => {

                    if (errorStock) {
                        return res.status(500).json({
                            mensaje: "Consumo registrado pero error al actualizar stock"
                        });
                    }

                    res.status(201).json({
                        mensaje: "Consumo registrado correctamente y stock actualizado",
                        id_consumo: results.insertId
                    });

                }
            );

        }
    );

};

const obtenerConsumosPorIntervencion = (req, res) => {

    const { id_intervencion } = req.params;

    const sql = `
        SELECT *
        FROM intervenciones_repuestos
        WHERE id_intervencion = ?
    `;

    connection.query(sql, [id_intervencion], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar consumos"
            });
        }

        res.status(200).json(results);

    });

};

module.exports = {
    registrarConsumo,
    obtenerConsumosPorIntervencion
};