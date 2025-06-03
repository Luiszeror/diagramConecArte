require("dotenv").config();
const fileUpload = require("express-fileupload");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Middlewares
app.use(cors());
app.use(fileUpload({ useTempFiles: true, tempFileDir: './uploads/' }));
app.use(express.json());

//Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((error) => console.error(" Error conectando a MongoDB:", error));

//Importar rutas
const productosRoutes = require("./routes/productos");

//Usar rutas
app.use("/productos", productosRoutes);

//Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("API de Productos!");
});

//Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
