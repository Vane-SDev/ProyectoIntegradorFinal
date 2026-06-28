const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/", usuarioController.obtenerUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);
router.post("/", usuarioController.crearUsuario);
router.put("/:id", usuarioController.actualizarUsuario);
router.patch("/estado/:id", usuarioController.alternarEstadoUsuario); // <-- NUEVA

module.exports = router;