require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((error) => console.error(" Error conectando a MongoDB:", error));

//Importar rutas
const reviewsRoutes = require("./routes/Resenas");


//Usar rutas
app.use("/resenas", reviewsRoutes);


//Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("API Reseñas!");
});

//Iniciar servidor
const PORT = process.env.PORT || 50003;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
