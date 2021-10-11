//? Rutas para Authenticar Usuarios
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

//*Iniciar Sesion

//? EndPoint api/auth

router.post(
  "/",

  authController.autenticarUsuario
);

//*Obtiene el Usuario Autenticado
router.get("/", auth, authController.usuarioAutenticado);
module.exports = router;
