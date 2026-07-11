const express = require("express");

const router = express.Router();

const { 
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie

} = require("../controllers/movieController");

router.post("/", createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.put("/:id", updateMovie);

module.exports = router;