const express = require("express");
const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");
const Producto = require("../models/Producto");
const Tienda = require("../models/Vendedor"); // Asegúrate de que este modelo esté correctamente importado

const router = express.Router();


//Obtener todos los productos (GET)
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los productos", error });
    }
});

// Obtener un producto por ID (GET)
router.get("/:id", async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el producto", error });
    }
});

// Crear un nuevo producto (POST)
router.post("/", async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el producto", error });
    }
});

// Actualizar un producto por ID (PUT)
router.put("/:id", async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el producto", error });
    }
});

router.delete("/:id/:id_vendedor", async (req, res) => {
  try {
    const idProducto = req.params.id;
    const id = req.params.id_vendedor;

    // Buscar el producto para obtener el public_id de la imagen
    const producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const publicIdImagen = producto.image?.id;

    // Eliminar la imagen desde el microservicio
    if (publicIdImagen) {
      try {
        await axios.delete(`https://conecarte-ciq4.onrender.com/imagenes/${publicIdImagen}`);
        console.log("Imagen eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar la imagen:", error.message);
      }
    }

    // Elimina el producto
    const productoEliminado = await Producto.findByIdAndDelete(idProducto);
    if (!productoEliminado) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Quitar el ID del producto de todas las tiendas que lo tengan
     try {
        const response = await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/${id}`);
        const data = await response.json();

        const productos = data.productos_ids

        const nuevaLista = productos.filter(item => item.toString() !== idProducto);
        await Tienda.findByIdAndUpdate(id, { productos_ids: nuevaLista }, { new: true });

    } catch (error) {
        console.error('Error al modificar tienda:', error);
    }

    res.json({ mensaje: "Producto eliminado y eliminado de las tiendas asociadas" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el producto", error });
  }
});

router.post("/detalles", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ mensaje: "Debe enviar un array de ids de productos" });
    }

    const productos = await Producto.find({ _id: { $in: ids } });

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos", error });
  }
});


module.exports = router;
