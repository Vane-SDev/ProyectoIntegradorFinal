const express = require("express");
const router = express.Router();

const consumoRepuestoController = require("../controllers/consumoRepuestoController");

router.post(
    "/consumos",
    consumoRepuestoController.registrarConsumo
);

router.get(
    "/consumos/:id_intervencion",
    consumoRepuestoController.obtenerConsumosPorIntervencion
);

module.exports = router;