const express = require("express");
const Resena = require("../models/Resena");
const axios = require('axios');
const router = express.Router();


//Obtener todos los reseñas (GET)
router.get("/", async (req, res) => {
    try {
        const resena = await Resena.find();
        res.json(resena);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las reseñas", error });
    }
});

//Obtener un reseña por ID (GET)
router.get("/:id", async (req, res) => {
    try {
        const resena = await Resena.findById(req.params.id);
        if (!resena) {
            return res.status(404).json({ mensaje: "Reseña no encontrada" });
        }
        res.json(resena);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la reseña", error });
    }
});

//Crear una nueva reseña (POST)
router.post("/", async (req, res) => {
    try {
        const nuevaResena = new Resena({
            ...req.body,
            fecha: new Date().toISOString()
        });

        await nuevaResena.save();
        res.status(201).json(nuevaResena);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la reseña", error });
    }
});


//Actualizar una reseña por ID (PUT)
router.put("/:id", async (req, res) => {
    try {
        const resenaActualizado = await resena.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!resenaActualizado) {
            return res.status(404).json({ mensaje: "Reseña no encontrada" });
        }
        res.json(resenaActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la reseña", error });
    }
});

//Eliminar una reseña por ID (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const resenaEliminado = await Resena.findByIdAndDelete(req.params.id);
        if (!resenaEliminado) {
            return res.status(404).json({ mensaje: "Reseña no encontrada" });
        }
        res.json({ mensaje: "Reseña eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la reseña", error });
    }
});



router.get("/producto/:id", async (req, res) => {
  try {
    const reseñas = await Resena.find({ id_producto: req.params.id });

    const reseñasConNombre = await Promise.all(reseñas.map(async (r) => {
      try {
        const respuesta = await axios.get(`https://conecarte-8olx.onrender.com/usuarios/usuarios/${r.id_usuario}`);
        const username = respuesta.data.username;
        return { ...r._doc, nombre_usuario: username };
      } catch (e) {
        return { ...r._doc, nombre_usuario: "Usuario desconocido" };
      }
    }));

    res.json(reseñasConNombre);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reseñas" });
  }
});



module.exports = router;
