const connection = require("../database/connection");

const obtenerActivos = (req, res) => {
    const sql = "SELECT * FROM activos WHERE activo = true";
    connection.query(sql, (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error al obtener activos" });
        res.status(200).json(results);
    });
};

const crearActivo = (req, res) => {
    const {
        codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad
    } = req.body;

    const sql = `
        INSERT INTO activos (
            codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad],
        (error, results) => {
            if (error) return res.status(500).json({ mensaje: "Error al crear el activo", error });
            res.status(201).json({ mensaje: "Activo creado correctamente", id_activo: results.insertId });
        }
    );
};

const obtenerActivoPorId = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM activos WHERE id_activo = ?";
    connection.query(sql, [id], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error al consultar activo" });
        if (results.length === 0) return res.status(404).json({ mensaje: "Activo no encontrado" });
        res.status(200).json(results[0]);
    });
};

const actualizarActivo = (req, res) => {
    const { id } = req.params;
    const {
        codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad, estado
    } = req.body;

    const sql = `
        UPDATE activos SET
            codigo = ?, nombre = ?, descripcion = ?, fabricante = ?, modelo = ?, 
            numero_serie = ?, area = ?, planta = ?, sector = ?, criticidad = ?, estado = ?
        WHERE id_activo = ?
    `;

    connection.query(
        sql,
        [codigo, nombre, descripcion, fabricante, modelo, numero_serie, area, planta, sector, criticidad, estado, id],
        (error) => {
            if (error) return res.status(500).json({ mensaje: "Error al actualizar activo" });
            res.status(200).json({ mensaje: "Activo actualizado correctamente" });
        }
    );
};

const desactivarActivo = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE activos SET activo = false, estado = 'Fuera de Servicio' WHERE id_activo = ?";
    connection.query(sql, [id], (error) => {
        if (error) return res.status(500).json({ mensaje: "Error al desactivar activo" });
        res.status(200).json({ mensaje: "Activo desactivado" });
    });
};

module.exports = {
    obtenerActivos, crearActivo, obtenerActivoPorId, actualizarActivo, desactivarActivo
};