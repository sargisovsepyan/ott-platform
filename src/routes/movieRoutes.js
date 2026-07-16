const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie

} = require("../controllers/movieController");

router.post("/", authMiddleware, createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;