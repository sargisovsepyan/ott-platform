const Movie = require("../models/Movie");
const asyncHandler = require("../utils/asyncHandler");

//создаёт новый фильм в базе данных
const createMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.create(req.body);

    res.status(201).json(movie);
});

// Возвращает массив фильмов с учетом поиска и фильтрации.
const getAllMovies = asyncHandler(async (req, res) => {
    // Получаем параметры из URL.
    const { search, year, genre } = req.query;

    // Объект для хранения условий поиска и фильтрации.
    const filter = {};

    // поиск по названию
    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };
    }

    // Фильтр по году.
    if (year) {
        filter.year = year;
    }

    // Фильтр по жанру.
    if (genre) {
        filter.genre = genre;
    }

    // Получаем фильмы с учетом поиска и фильтрации.
    const movies = await Movie.find(filter);

    res.status(200).json(movies);
});

//Ищет фильм по ID
const getMovieById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    res.status(200).json(movie);
});

//обновляет данные фильма, по его ID
const updateMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedMovie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    res.status(200).json(updatedMovie);
});

//удаляет фильм по его ID
const deleteMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    res.status(200).json({
        message: "Movie deleted successfully",
    });
});

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
};