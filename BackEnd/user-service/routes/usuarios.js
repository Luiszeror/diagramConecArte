const express = require("express");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const router = express.Router();


//Obtener todos los usuarios (GET)
router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los usuarios", error });
    }
});

//Obtener un usuario por ID (GET)
router.get("/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el usuario", error });
    }
});

//Crear un nuevo usuario (POST)
router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            correo,
            contraseña,
            tipo_usuario,
            username,
            fecha_nacimiento,
            departamento,
            ciudad,
            direccion,
            genero,
            tipo_documento,
            documento,
            celular,
            fecha_creacion
        } = req.body;

        // Verificar si ya existe el usuario por username o correo
        const usuarioExistente = await Usuario.findOne({
            $or: [{ username }, { correo }]
        });

        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El nombre de usuario o correo ya existe" });
        }

        // Encriptar la contraseña
        const contraseñaEncriptada = await bcrypt.hash(contraseña, 8);

        // Crear el nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            correo,
            contraseña: contraseñaEncriptada,
            tipo_usuario,
            username,
            fecha_nacimiento,
            departamento,
            ciudad,
            direccion,
            genero,
            tipo_documento,
            documento,
            celular,
            fecha_creacion
        });

        // Guardar en la base de datos
        await nuevoUsuario.save();

        // Crear el carrito para el usuario llamando al otro servicio
        if (nuevoUsuario.tipo_usuario == "usuario") {
            try {
                await axios.post("https://conecarte-8olx.onrender.com/carritos/carritos", {
                    id_usuario: nuevoUsuario._id,
                    productos: [],
                    total: 0
                });
            } catch (carritoError) {
                console.error("Error al crear carrito:", carritoError.message);
                // No cortamos el proceso por error en carrito, solo notificamos
            }
        }


        res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ mensaje: "Error al crear el usuario", error });
    }
});


//Actualizar un usuario por ID (PUT)
router.put("/:id", async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el usuario", error });
    }
});

// Eliminar un usuario por ID (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
    }
});

// Ruta de login (POST)
router.post("/login", async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar al usuario por nombre
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(401).json({ mensaje: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario._id, correo: usuario.correo, tipo_usuario: usuario.tipo_usuario },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ mensaje: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el login", error });
    }
});


module.exports = router;
