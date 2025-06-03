const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: "dswehokfp",
    api_key: "492636615723364",
    api_secret: "spmpYBP5Kz66fA2qtmLiVmcohvc",
    secure: true,
});

async function uploadImage(filePath, iduser) {
    return await cloudinary.uploader.upload(filePath, {
        folder: iduser,
        resource_type: "image"
    });
}

async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId);
}

module.exports = {
    uploadImage,
    deleteImage
};
