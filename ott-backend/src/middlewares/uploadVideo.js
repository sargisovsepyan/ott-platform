const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Загружает превью-видео фильмов в Cloudinary.
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ott-platform/movies",
        resource_type: "video",
        allowed_formats: ["mp4"],
    },
});

const uploadVideo = multer({
    storage: videoStorage,

    limits: {
        fileSize: 200 * 1024 * 1024,
    },

    fileFilter: (req, file, callback) => {
        if (file.mimetype !== "video/mp4") {
            return callback(
                new Error("Only MP4 video files are allowed")
            );
        }

        callback(null, true);
    },
});

module.exports = uploadVideo;