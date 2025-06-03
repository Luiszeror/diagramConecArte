const express = require("express");
const Factura = require("../models/factura");
const axios = require("axios");
const router = express.Router();


//Obtener todos las facturas (GET)
router.get("/", async (req, res) => {
    try {
        const factura = await Factura.find();
        res.json(factura);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las facturas", error });
    }
});

//Obtener una factura por ID (GET)
router.get("/:id", async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id);
        if (!factura) {
            return res.status(404).json({ mensaje: "Factura no encontrada" });
        }
        res.json(factura);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la factura", error });
    }
});

router.post('/facturar', async (req, res) => {
  try {
    const { id_usuario, metodo_pago, referencia } = req.body;

    // 1. Obtener carrito del microservicio de carrito
    const { data: carrito } = await axios.get(`https://conecarte-8olx.onrender.com/carritos/carritos/usuario/${id_usuario}`);

    if (!carrito || !carrito.productos || carrito.productos.length === 0) {
      return res.status(404).json({ mensaje: 'El carrito está vacío o no existe' });
    }

    // 2. Crear factura
    const nuevaFactura = new Factura({
      id_usuario,
      metodo_pago,
      referencia,
      valor: carrito.total,
      productos: carrito.productos.map(({ id_producto, cantidad }) => ({
        id_producto,
        cantidad
      }))
    });

    await nuevaFactura.save();

    // 3. Vaciar carrito (suponiendo que existe un endpoint para esto)
    await axios.put(`https://conecarte-8olx.onrender.com/carritos/carritos/vaciar/${id_usuario}`);

    res.status(201).json({ mensaje: 'Factura generada y carrito vaciado', factura: nuevaFactura });

  } catch (error) {
    console.error('Error al generar factura:', error.message);
    res.status(500).json({ mensaje: 'Error al generar la factura', error: error.message });
  }
});

//Actualizar una factura por ID (PUT)
router.put("/:id", async (req, res) => {
    try {
        const facturaActualizado = await Factura.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!facturaActualizado) {
            return res.status(404).json({ mensaje: "Factura no encontrada" });
        }
        res.json(facturaActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la factura", error });
    }
});

//Eliminar una factura por ID (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const facturaEliminado = await Factura.findByIdAndDelete(req.params.id);
        if (!facturaEliminado) {
            return res.status(404).json({ mensaje: "Factura no encontrada" });
        }
        res.json({ mensaje: "Factura eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la factura", error });
    }
});

module.exports = router;
