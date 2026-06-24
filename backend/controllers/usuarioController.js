const connection = require("../database/connection");

const obtenerUsuarios = (req, res) => {
    console.log("--- EL BACKEND RECIBIÓ UNA PETICIÓN EN /usuarios ---"); 

    const sql = `
        SELECT
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.email,
            u.activo,
            r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r
            ON u.id_rol = r.id_rol
    `;

    connection.query(sql, (error, results) => {

        if (error) {
            console.log("ERROR SQL:", error);
            return res.status(500).json({
                mensaje: "Error al obtener usuarios"
            });
        }

        res.status(200).json(results);

    });

};

const crearUsuario = (req, res) => {

    const {
        nombre,
        apellido,
        email,
        password,
        id_rol
    } = req.body;

    const sql = `
        INSERT INTO usuarios
        (nombre, apellido, email, password, id_rol)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [nombre, apellido, email, password, id_rol],
        (error, results) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al crear el usuario",
                    error
                });
            }

            res.status(201).json({
                mensaje: "Usuario creado correctamente",
                id_usuario: results.insertId
            });

        }
    );

};
const obtenerUsuarioPorId = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.email,
            u.id_rol,
            u.activo,
            r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r
            ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
    `;

    connection.query(sql, [id], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar usuario"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(results[0]);

    });

};
const actualizarUsuario = (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        apellido,
        email,
        id_rol
    } = req.body;

    const sql = `
        UPDATE usuarios
        SET
            nombre = ?,
            apellido = ?,
            email = ?,
            id_rol = ?
        WHERE id_usuario = ?
    `;

    connection.query(
        sql,
        [nombre, apellido, email, id_rol, id],
        (error, results) => {

            if (error) {
                return res.status(500).json({
                    mensaje: "Error al actualizar usuario"
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }

            res.status(200).json({
                mensaje: "Usuario actualizado correctamente"
            });

        }
    );

};

module.exports = {
    obtenerUsuarios,
    crearUsuario,
    obtenerUsuarioPorId,
    actualizarUsuario
};