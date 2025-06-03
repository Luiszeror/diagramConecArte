const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads/',
}));

//Importar rutas
const imagenesRoutes = require("./routes/imagenes");

//Usar rutas
app.use("/imagenes", imagenesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
