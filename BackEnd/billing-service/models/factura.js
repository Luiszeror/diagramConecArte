const mongoose = require("mongoose");


const productoSchema = new mongoose.Schema({
  id_producto: { type: String, required: true },
  cantidad: { type: Number, required: true }
});

const facturaSchema = new mongoose.Schema({
  id_usuario: { type: String, required: true },
  metodo_pago: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  referencia: { type: String, required: true },
  valor: { type: Number, required: true },
  productos: [productoSchema]
}, { collection: 'Facturacion' });


const Facturacion = mongoose.model("Facturacion", facturaSchema); // El primer parámetro no afecta la colección en la BD

module.exports = Facturacion;
