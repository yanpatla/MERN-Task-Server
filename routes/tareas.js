const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//*Crear una Tarea
//?api/tareas

router.post(
  "/",
  auth,
  [check("nombre", "El nombre es obvligatorio").not().isEmpty()],
  [check("proyecto", "El proyecto es obvligatorio").not().isEmpty()],
  tareaController.crearTarea
);

//* Obtener las Tareas por Proyecto

router.get("/", auth, tareaController.obtenerTrareas);

//*Actualizar Tarea by ID

router.put("/:id", auth, tareaController.actualizarTarea);


//*Eliminar Tarea by ID
router.delete("/:id", auth, tareaController.eliminarTarea);






module.exports = router;
