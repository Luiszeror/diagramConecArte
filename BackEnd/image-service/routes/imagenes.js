const express = require("express");
const fs = require("fs-extra");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const router = express.Router();

router.post("/:id", async (req, res) => {

    const id = req.params.id;

    console.log("ID del artesano:", id);
    console.log("Archivos recibidos:", req.files);

    if (!req.files || !req.files.image) {
    return res.status(400).json({ message: "No se subió ninguna imagen" });
    }

    const file = req.files.image.tempFilePath;

    try {
        const result = await uploadImage(file, id);
        imagen = {
            id: result.public_id,
            url: result.secure_url,
        }

        await fs.unlink(file); // Eliminar el archivo temporal después de subirlo

        res.json({
            message: "Imagen subida correctamente",
            data: imagen,
        });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        res.status(500).json({ message: "Error al subir la imagen" });
    }
});

router.delete("/:id/:id2", async (req, res) => {
    const publicId = req.params.id+"/"+req.params.id2;

    try {
        await deleteImage(publicId);
        res.json({ message: "Imagen eliminada correctamente de Cloudinary" });
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        res.status(500).json({ message: "Error al eliminar la imagen" });
    }
});

router.get('/', (req, res) => {
  res.status(200).send('OK');
});


module.exports = router;