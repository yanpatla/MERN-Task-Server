const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//*Crear un Proyectos

//? EndPoint api/proyectos

router.post(
  "/",
  auth,
  [check("nombre", "El nombre del Proyecto es Obligatorio").not().isEmpty()],
  proyectoController.crearProyecto
);

//*Obtener Proyectos
router.get("/", auth, proyectoController.obtenerProyectos);
//*Actualizar Proyectos by ID
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre del Proyecto es Obligatorio").not().isEmpty()],
  proyectoController.actualizarProyecto
);

//* Eliminar un Proyecto
router.delete(
  "/:id",
  auth,
  proyectoController.eliminarProyecto
);

module.exports = router;
