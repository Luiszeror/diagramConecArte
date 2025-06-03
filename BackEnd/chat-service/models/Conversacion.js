const mongoose = require('mongoose');

const conversacionSchema = new mongoose.Schema({
    id_emisor: String,
    id_receptor:String,
    mensajes:[String]
}, { collection: "Conversacion" }); // Forzamos el nombre de la colección

const Conversacion = mongoose.model('Conversacion', conversacionSchema);
module.exports = Conversacion;
