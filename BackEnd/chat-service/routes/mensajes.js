const express = require("express");
const Mensaje = require("../models/Mensaje");
const router = express.Router();


// Obtener todos los mensajes (GET)
router.get("/", async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los mensajes", error });
    }
});

//Obtener un mensaje por ID (GET)
router.get("/:id", async (req, res) => {
    try {
        const mensaje = await Mensaje.findById(req.params.id);
        if (!mensaje) {
            return res.status(404).json({ mensaje: "Mensaje no encontrado" });
        }
        res.json(mensaje);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el mensaje", error });
    }
});

// Crear un nuevo mensaje (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoMensaje = new Mensaje(req.body);
        await nuevoMensaje.save();
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el mensaje", error });
    }
});

//Actualizar un mensaje por ID (PUT)
router.put("/:id", async (req, res) => {
    try {
        const mensajeActualizado = await Mensaje.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!mensajeActualizado) {
            return res.status(404).json({ mensaje: "Mensaje no encontrado" });
        }
        res.json(mensajeActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el mensaje", error });
    }
});

// Eliminar un mensaje por ID (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const mensajeEliminado = await Mensaje.findByIdAndDelete(req.params.id);
        if (!mensajeEliminado) {
            return res.status(404).json({ mensaje: "Mensaje no encontrado" });
        }
        res.json({ mensaje: "Mensaje  eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el mensaje", error });
    }
});

module.exports = router;
