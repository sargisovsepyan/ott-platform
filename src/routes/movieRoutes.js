const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
} = require("../controllers/movieController");

router.get("/", getAllMovies);
router.get("/:id", getMovieById);

router.post("/", authMiddleware, adminMiddleware, createMovie);
router.patch("/:id", authMiddleware, adminMiddleware, updateMovie);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMovie);

module.exports = router;
