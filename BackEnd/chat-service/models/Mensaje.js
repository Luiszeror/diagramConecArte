const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
 id_emisor: String,
 fecha_envio:Date,
 contenido:String,
 estado_mensaje:String
}, { collection: "Mensaje" }); // Forzamos el nombre de la colección

const Mensaje = mongoose.model('Mensaje', mensajeSchema);
module.exports = Mensaje;
