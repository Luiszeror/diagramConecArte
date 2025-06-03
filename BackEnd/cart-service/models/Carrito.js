const mongoose = require('mongoose');

const ProductoEnCarritoSchema = new mongoose.Schema({
    id_producto: {
      type: String,
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    }
  });

const carritoSchema = new mongoose.Schema({
 id_usuario: String,
 productos:[ProductoEnCarritoSchema],
 total:Number,
}, { collection: "Carrito" }); 

const Carrito = mongoose.model('Carrito', carritoSchema);
module.exports = Carrito;
