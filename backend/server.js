const app = require("./app");


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto http://localhost:${PORT}`);
});