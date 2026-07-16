const express = require("express");

const router = express.Router();

const { 
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie

} = require("../controllers/movieController");

router.post("/", createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;