const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyecto = async (req, res) => {
  //*Revisar si hay Errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    //*Crear un Nuevo Proyecto

    const proyecto = new Proyecto(req.body);

    //* Guardar el Creador via JWT
    proyecto.creador = req.usuario.id;

    //*Guardamos El Proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un Error");
  }
};

//! Obtiene Todos los Proyectos del Usuario Actual

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500) / send("Hubo un Error");
  }
};

//! Actualizar un Proyecto

exports.actualizarProyecto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //*Extraer la Info del Proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    //*Revisar el Id
    let proyecto = await Proyecto.findById(req.params.id);

    //* Si el Proyecto Exciste o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no Encontrado" });
    }
    //* Verificar el Creador del Proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //* Actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un Error ");
  }
};

//*Elimina un Proyecto by ID

exports.eliminarProyecto = async (req, res) => {
  try {
    //*Revisar el Id
    let proyecto = await Proyecto.findById(req.params.id);

    //* Si el Proyecto Exciste o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no Encontrado" });
    }
    //* Verificar el Creador del Proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //*Eliminar el Proyecto

    await Proyecto.findOneAndRemove({_id: req.params.id })
    res.json({msg:'Proyecto eliminado'})
  } catch (error) {
    console.log(error);
    res.status(500).send('Eror en el Servidor')
  }
};
