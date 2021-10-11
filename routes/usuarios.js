//? Rutas para Crear Usuarios
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

//*Crear un Usuario

//? EndPoint api/usuarios

router.post(
  "/",
  [
      check('nombre', 'El Nombre es Obvligatorio').not().isEmpty(),
      check('email', 'Agrega un Emial Valido').isEmail(),
      check('password', 'El password debe ser Minimo de 6 Caracteres').isLength({min:6})
  ],

  usuarioController.crearUsuario
);

module.exports = router;
