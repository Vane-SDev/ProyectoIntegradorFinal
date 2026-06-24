const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'sigma',
  
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar con MySQL:", error);
    return;
  }
  console.log("Conexión a MySQL establecida correctamente");
});

module.exports = connection;