const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
//*Crea una Nueva Tarea

exports.crearTarea = async (req, res) => {
  //*Revisar si hay Errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //*Extraer el Proyecto y Compraobar si existe

    const { proyecto } = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no Encontrado" });
    }

    //*Revisar si el Proyecto actual Pertenece al Usario Autenticado

    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //*Creamos la tarea

    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un Error");
  }
};

//TODO Obtiene las Tareas por Proyecto
exports.obtenerTrareas = async (req, res) => {
  try {
    //*Extraer el Proyecto y Compraobar si existe

    const { proyecto } = req.query;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no Encontrado" });
    }

    //*Revisar si el Proyecto actual Pertenece al Usario Autenticado

    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //*Obtener las Tareas por Proyecto
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//TODO Actualizar Tarea

exports.actualizarTarea = async (req, res) => {
  try {
    //*Extraer el Proyecto y Compraobar si existe

    const { proyecto, nombre, estado } = req.body;

    //*Revisar si la Tarea Existe o no
    let tareaExtiste = await Tarea.findById(req.params.id);
    if (!tareaExtiste) {
      return res.status(401).json({ msg: "No Exciste esa Tarea" });
    }

    //*Extraer Proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //*Revisar si el Proyecto actual Pertenece al Usario Autenticado

    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //*Crear un Objeto con la Nueva Info

    const nuevaTarea = {}; //? Lo Vamos a ir Llenando con una Serie de IF
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //*Guardar la Tarea
    tareaExtiste = await Tarea.findOneAndUpdate(
      { _id: req.params.id },
      nuevaTarea,
      { new: true }
    );
    res.json({ tareaExtiste });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//TODO Elimar Tarea

exports.eliminarTarea = async (req, res) => {
  try {
    //*Extraer el Proyecto y Compraobar si existe

    const { proyecto } = req.query;

    //*Revisar si la Tarea Existe o no
    let tareaExtiste = await Tarea.findById(req.params.id);
    if (!tareaExtiste) {
      return res.status(401).json({ msg: "No Exciste esa Tarea" });
    }

    //*Extraer Proyecto
    const existeProyecto = await Proyecto.findById(proyecto);

    //*Revisar si el Proyecto actual Pertenece al Usario Autenticado

    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    //*Eliminar

    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
