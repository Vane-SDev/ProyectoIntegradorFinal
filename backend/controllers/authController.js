const connection = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const SECRET_KEY = "SIGMA_CMMS_SUPER_SECRET_KEY_2026";

const login = (req, res) => {
    const { email, password } = req.body;
    console.log("DEBUG LOGIN: Intentando autenticar:", email);

    
    const sql = `
        SELECT u.*, r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.id_rol = r.id_rol
        WHERE u.email = ?
    `;

    connection.query(sql, [email], async (error, results) => {
        if (error) {
            console.error("Error SQL:", error);
            return res.status(500).json({ mensaje: "Error interno del servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const usuario = results[0];

        
        let passwordValida = false;
        
        
        if (usuario.password.startsWith("$2b$") || usuario.password.startsWith("$2a$")) {
            passwordValida = await bcrypt.compare(password, usuario.password);
        } else {
           
            console.warn("ADVERTENCIA: Usuario usando contraseña sin encriptar.");
            passwordValida = (password === usuario.password);
        }

        if (!passwordValida) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                id_rol: usuario.id_rol,
                rol: usuario.rol
            },
            SECRET_KEY,
            { expiresIn: "8h" } 
        );

        delete usuario.password;

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token: token,
            usuario: usuario
        });
    });
};

module.exports = {
    login
};