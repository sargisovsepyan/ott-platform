const Movie = require("../models/Movie");

const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);

        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await Movie.findById(id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found",
            });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMovie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(updatedMovie);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie
};