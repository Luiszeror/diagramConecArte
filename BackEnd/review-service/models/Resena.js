// models/Vendedor.js
const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  id_producto: String,
  id_usuario: String,
  calificacion: Number,
  comentario: String,
  fecha: Date
}, { collection: "Reseña" }); // Forzamos el nombre de la colección

const Resena = mongoose.model('Reseña', resenaSchema);
module.exports = Resena;
