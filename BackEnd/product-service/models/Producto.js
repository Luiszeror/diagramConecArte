const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    id: String,
    id_artesano: String,
    nombre: String,
    descripcion: String,
    precio: Number,
    cantidad: Number,
    ubicacion: String,
    fecha_creacion: Date,
    id_categoria: String,
    image:{
        id: String, // ID de la imagen en Cloudinary
        url: String // URL de la imagen en Cloudinary
    }
}, { collection: "Producto" }); // Forzamos el nombre de la colección

const Producto = mongoose.model("Producto", productoSchema); // El primer parámetro no afecta la colección en la BD

module.exports = Producto;
