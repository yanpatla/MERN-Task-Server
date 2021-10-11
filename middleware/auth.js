const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //*Leer el Token de Header
  const token = req.header("x-auth-token");

  //*Revisar si no Hay Token

  if (!token) {
    return res.status(401).json({ msg: "No hay Token Permiso no Valido" });
  }

  //* Valdiar Token

  try {
    const cifrado = jwt.verify(token, process.env.SECRETJWT);

    //? Es cifrado.usuario ya que cuando se Agrega un  Nuevo usuario al payload le pasamos el usuario
    //* Esto va a generar un nuevo objeto que es req.usuario el cual con este vamos a poder extraer su id
    req.usuario = cifrado.usuario;
    next()
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token no Valido" });
  }
};
