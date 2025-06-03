// models/Vendedor.js
const mongoose = require('mongoose');

const vendedorSchema = new mongoose.Schema({
  nombre_tienda: String,
  descripcion_tienda:  String,
  categorias: [String],
  experiencia: Number,
  redes_sociales: [String],
  productos_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Producto',
    default: []  // 👈 Esto garantiza que aparezca incluso vacío
  },
  fecha_registro: Date,
  id_usuario: String
}, { collection: "Vendedor" });

const Vendedor = mongoose.model('Vendedor', vendedorSchema);
module.exports = Vendedor;
