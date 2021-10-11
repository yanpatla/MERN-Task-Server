const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  //* Revisar si hay Errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //*Extraer el Email y Passoword del Req
  const { email, password } = req.body;

  try {
    //*Revisar que sea un usuario Registrado
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no Existe" });
    }

    //* Revisar la Passoword
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }

    //* Si todo es CorrectoCrear y Firmar el JWT

    const payload = {
      usuario: {
        //? el usuario.id viene del usuario que se esta guardando
        id: usuario.id,
      },
    };

    //*Firmar el JWT
    jwt.sign(
      payload,
      process.env.SECRETJWT,
      {
        expiresIn: 3600, //1hs
      },
      (error, token) => {
        if (error) throw error;
        //*Mensaje de Confirmacion

        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//*Obtiene que usuario Autenticado

exports.usuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');//? Este select significa que quieres o no que se muestre poniendo un -
    res.json({usuario});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un Error" });
  }
};
