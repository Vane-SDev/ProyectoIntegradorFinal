const connection = require("../database/connection");

const login = (req, res) => {

    const { email, password } = req.body;
    console.log("DEBUG LOGIN: Email recibido:", email, "Password recibido:", password);
    const sql = `
        SELECT u.*, r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.email = ? AND u.password = ?
    `;

    connection.query(sql, [email, password], (error, results) => {

        if (error) {
            return res.status(500).json({
                mensaje: "Error del servidor"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            usuario: results[0]
        });

    });

};

module.exports = {
    login
};