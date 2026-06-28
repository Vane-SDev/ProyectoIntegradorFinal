require('dotenv').config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar con MySQL:", error);
    return;
  }
  console.log("Conexión a MySQL establecida correctamente");
});

module.exports = connection;