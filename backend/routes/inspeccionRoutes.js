const express = require("express");
const router = express.Router();

const inspeccionController = require("../controllers/inspeccionController");

router.get("/inspecciones", inspeccionController.obtenerInspecciones);

router.get("/inspecciones/:id", inspeccionController.obtenerInspeccionPorId);

router.get(
    "/inspecciones/activo/:id_activo",
    inspeccionController.obtenerInspeccionesPorActivo
);

router.post("/inspecciones", inspeccionController.crearInspeccion);

module.exports = router;