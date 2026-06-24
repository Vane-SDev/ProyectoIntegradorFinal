const express = require("express");
const router = express.Router();
const ordenTrabajoController = require("../controllers/ordenTrabajoController");

// 1. Colección General
router.get("/", ordenTrabajoController.obtenerOrdenes);
router.post("/", ordenTrabajoController.crearOrden);

// 2. Filtros relacionales (SIEMPRE arriba del :id)
router.get("/activo/:id_activo", ordenTrabajoController.obtenerOrdenesPorActivo);
router.get("/tecnico/:id_tecnico", ordenTrabajoController.obtenerOrdenesPorTecnico);

// 3. Operaciones sobre un ID específico
router.get("/:id", ordenTrabajoController.obtenerOrdenPorId);
router.put("/:id", ordenTrabajoController.actualizarOrden);
router.patch("/estado/:id", ordenTrabajoController.cambiarEstadoOrden);

module.exports = router;