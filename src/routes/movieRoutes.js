const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
} = require("../controllers/movieController");

router.get("/", getAllMovies);
router.get("/:id", getMovieById);

router.post("/", authMiddleware, createMovie);
router.patch("/:id", authMiddleware, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

module.exports = router;
