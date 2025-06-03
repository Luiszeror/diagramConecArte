const express = require("express");
const Conversacion = require("../models/Conversacion");

const router = express.Router();


//Obtener todos las conversaciones (GET)
router.get("/", async (req, res) => {
    try {
        const conversacion = await Conversacion.find();
        res.json(conversacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las conversaciones", error });
    }
});

//Obtener una conversacion por ID (GET)
router.get("/:id", async (req, res) => {
    try {
        const conversacion = await Conversacion.findById(req.params.id);
        if (!conversacion) {
            return res.status(404).json({ mensaje: "Conversacion no encontrada" });
        }
        res.json(conversacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la conversacion", error });
    }
});

//Crear una nuevo conversacion (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoConversacion = new Conversacion(req.body);
        await nuevoConversacion.save();
        res.status(201).json(nuevoConversacion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear la conversacion", error });
    }
});

//Actualizar una conversacion por ID (PUT)
router.put("/:id", async (req, res) => {
    try {
        const conversacionActualizado = await Conversacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!conversacionActualizado) {
            return res.status(404).json({ mensaje: "Conversacion no encontrada" });
        }
        res.json(conversacionActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la conversacion", error });
    }
});

//Eliminar una conversacion por ID (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const conversacionEliminado = await Conversacion.findByIdAndDelete(req.params.id);
        if (!conversacionEliminado) {
            return res.status(404).json({ mensaje: "Conversacion no encontrada" });
        }
        res.json({ mensaje: "Conversacion eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la conversacion", error });
    }
});

module.exports = router;
