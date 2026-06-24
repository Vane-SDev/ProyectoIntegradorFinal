const express = require("express");
const router = express.Router();

const repuestoController = require("../controllers/repuestoController");

router.get("/", repuestoController.obtenerRepuestos);
router.post("/", repuestoController.crearRepuesto);

module.exports = router;