const express = require("express");
const router = express.Router();

const intervencionController = require("../controllers/intervencionController");

router.get(
    "/intervenciones",
    intervencionController.obtenerIntervenciones
);

router.post(
    "/intervenciones",
    intervencionController.crearIntervencion
);
router.get(
    "/intervenciones/activo/:id_activo",
    intervencionController.obtenerIntervencionesPorActivo
);

router.get(
    "/intervenciones/ot/:id_ot",
    intervencionController.obtenerIntervencionesPorOT
);

module.exports = router;