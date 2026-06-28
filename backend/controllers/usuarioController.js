const connection = require("../database/connection");
const bcrypt = require("bcrypt");

const obtenerUsuarios = (req, res) => {
    // Ahora sí le pedimos a MySQL su columna 'activo' real
    const sql = `
        SELECT 
            u.id_usuario, 
            u.nombre, 
            u.email, 
            u.id_rol,
            u.activo,
            r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
    `;

    connection.query(sql, (error, results) => {
        if (error) {
            console.log("ERROR SQL:", error);
            return res.status(500).json({ mensaje: "Error al obtener usuarios" });
        }
        res.status(200).json(results);
    });
};

const crearUsuario = async (req, res) => {
    const { nombre, email, password, id_rol } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Nace con activo = 1 por defecto según la base de datos
        const sql = `INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)`;
        
        connection.query(sql, [nombre, email, hashedPassword, id_rol], (error, results) => {
            if (error) return res.status(500).json({ mensaje: "Error al crear", error });
            res.status(201).json({ mensaje: "Usuario creado", id_usuario: results.insertId });
        });
    } catch (err) {
        res.status(500).json({ mensaje: "Error de seguridad", error: err });
    }
};

const obtenerUsuarioPorId = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT u.id_usuario, u.nombre, u.email, u.id_rol, u.activo, r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `;
    connection.query(sql, [id], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error SQL" });
        if (results.length === 0) return res.status(404).json({ mensaje: "No encontrado" });
        res.status(200).json(results[0]);
    });
};

// CUMPLE PROMESA DE TESIS: Modificación de datos personales y rol
const actualizarUsuario = (req, res) => {
    const { id } = req.params;
    const { nombre, email, id_rol } = req.body;

    const sql = `UPDATE usuarios SET nombre = ?, email = ?, id_rol = ? WHERE id_usuario = ?`;

    connection.query(sql, [nombre, email, id_rol, id], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error al actualizar" });
        res.status(200).json({ mensaje: "Usuario actualizado" });
    });
};

// NUEVA FUNCIÓN: Soft-Delete (Cambia entre operativo 1 y suspendido 0)
const alternarEstadoUsuario = (req, res) => {
    const { id } = req.params;
    const { activo } = req.body; // Recibe un 1 o un 0

    const sql = `UPDATE usuarios SET activo = ? WHERE id_usuario = ?`;

    connection.query(sql, [activo, id], (error, results) => {
        if (error) return res.status(500).json({ mensaje: "Error cambiando estado" });
        res.status(200).json({ mensaje: "Estado actualizado correctamente" });
    });
};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario,
    alternarEstadoUsuario
};