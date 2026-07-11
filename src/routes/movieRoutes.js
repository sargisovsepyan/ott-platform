const express = require("express");

const router = express.Router();

const { 
    createMovie,
    getAllMovies,
    getMovieById

} = require("../controllers/movieController");

router.post("/", createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

module.exports = router;