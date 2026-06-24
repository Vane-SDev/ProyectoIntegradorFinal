const express = require("express");
const router = express.Router();
const activoController = require("../controllers/activoController");

router.get("/", activoController.obtenerActivos);
router.post("/", activoController.crearActivo);

module.exports = router;