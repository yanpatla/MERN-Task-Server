const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //* Revisar si hay Errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //*Extraer Email y password
  const { email, password } = req.body;

  try {
    //*Revisar que el Usuario Registrado sea unico

    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya Existe" });
    }

    //*Crea el Nuevo usuario

    usuario = new Usuario(req.body);

    //*Hashear el Password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    //*Guaradar Usuario
    await usuario.save();

    //* Crear y Firmar el JWT
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
    res.status(400).send("Hubo un Error");
  }
};
