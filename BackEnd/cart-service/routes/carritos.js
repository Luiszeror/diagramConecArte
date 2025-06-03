const express = require("express");
const Carrito = require("../models/Carrito");
const axios = require("axios");
const router = express.Router();

// Obtener todos los carritos (GET)
router.get("/", async (req, res) => {
  try {
    const carritos = await Carrito.find();
    res.json(carritos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los carritos", error });
  }
});

router.get("/usuario/:id_usuario", async (req, res) => {
  try {
    const URL_PRODUCTOS = "https://conecarte-8olx.onrender.com/productos/productos/detalles";

    const carrito = await Carrito.findOne({ id_usuario: req.params.id_usuario });

    if (!carrito) {
      return res.status(404).json({ mensaje: "Carrito no encontrado para este usuario" });
    }

    const ids = carrito.productos.map(p => p.id_producto.toString());

    const { data: productos } = await axios.post(URL_PRODUCTOS, { ids });


    let total = 0;

    carrito.productos.forEach(item => {
      const producto = productos.find(p => p._id === item.id_producto);
      if (producto) {
        total += producto.precio * item.cantidad;
      }
    });


    carrito.total = total;
    await carrito.save();


    const carritoConDetalles = {
      ...carrito.toObject(),
      productosCom: productos
    };
    console.log(carritoConDetalles)

    res.status(200).json(carritoConDetalles);

  } catch (error) {
    console.error("Error al obtener el carrito con productos:", error.message);
    res.status(500).json({ mensaje: "Error al obtener el carrito", error: error.message });
  }
});

// POST /carritos/agregar
router.post("/agregar", async (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;

  if (!id_usuario || !id_producto || !cantidad) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  try {
    let carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      // Crear un nuevo carrito si no existe
      carrito = new Carrito({
        id_usuario,
        productos: [{ id_producto, cantidad }]
      });
    } else {
      // Verifica si el producto ya existe en el carrito
      const productoExistente = carrito.productos.find(
        p => p.id_producto.toString() === id_producto.toString()
      );
      if (productoExistente) {
        // Si ya existe, solo aumentar la cantidad
        productoExistente.cantidad += cantidad;
      } else {
        // Si no, añadir nuevo producto
        carrito.productos.push({ id_producto, cantidad });
      }
    }

    await carrito.save();
    res.status(200).json({ mensaje: "Producto agregado al carrito", carrito });

  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ mensaje: "Error al agregar producto", error });
  }
});


//Obtener un carrito por ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const carrito = await Carrito.findById(req.params.id);
    if (!carrito) {
      return res.status(404).json({ mensaje: "carrito no encontrado" });
    }
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el carrito", error });
  }
});

// Crear un nuevo carrito (POST)
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = new Carrito(req.body);
    await nuevoCarrito.save();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el carrito", error });
  }
});

//Actualizar un carrito por ID (PUT)
router.put("/:id", async (req, res) => {
  try {
    const carritoActualizado = await Carrito.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!carritoActualizado) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
    res.json(carritoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el carrito", error });
  }
});

// Eliminar un carrito por ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const carritoEliminado = await Carrito.findByIdAndDelete(req.params.id);
    if (!carritoEliminado) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
    res.json({ mensaje: "Carrito eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el carrito", error });
  }
});


// Eliminar un producto del carrito
router.delete("/:id_usuario/:id_producto", async (req, res) => {
  const { id_usuario, id_producto } = req.params;

  try {
    const carrito = await Carrito.findOne({ id_usuario });

    if (!carrito) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    // Filtra el array para eliminar el producto
    carrito.productos = carrito.productos.filter(
      p => p.id_producto !== id_producto
    );

    await carrito.save();

    res.status(200).json({ mensaje: "Producto eliminado del carrito", carrito });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});


router.put('/vaciar/:id_usuario', async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ id_usuario: req.params.id_usuario });

    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    carrito.productos = [];
    carrito.total = 0;
    await carrito.save();

    res.status(200).json({ mensaje: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error.message);
    res.status(500).json({ mensaje: 'Error al vaciar el carrito', error: error.message });
  }
});


module.exports = router;
