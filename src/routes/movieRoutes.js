
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const validateMovie = require("../middlewares/validateMovie");

const {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
} = require("../controllers/movieController");

//public
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

//admin
// POST/PATCH: Request -> authMiddleware -> adminMiddleware -> validateMovie -> movieController
router.post("/", authMiddleware, adminMiddleware, validateMovie, createMovie);
router.patch("/:id", authMiddleware, adminMiddleware, validateMovie, updateMovie);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMovie);

module.exports = router;
