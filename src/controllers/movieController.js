const Movie = require("../models/Movie");
const asyncHandler = require("../utils/asyncHandler");

//создаёт новый фильм в базе данных
const createMovie = asyncHandler(async (req, res) => {
    const movie = await Movie.create(req.body);

    res.status(201).json(movie);
});

// Возвращает фильмы с учетом поиска, фильтрации, сортировки и пагинации.
const getAllMovies = asyncHandler(async (req, res) => {
    // Получаем проверенные параметры из URL.
    const {
        search,
        year,
        genre,
        sort,
        page: pageNumber,
        limit: limitNumber,
    } = req.validatedQuery;

    // Сколько фильмов нужно пропустить.
    const skip = (pageNumber - 1) * limitNumber;

    // Объект для хранения условий поиска и фильтрации.
    const filter = {};

    // Поиск по названию фильма.
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

    // Сортируем по переданному полю или по году по умолчанию.
    const sortOption = sort || "-year";

    // Общее количество фильмов с учетом поиска и фильтрации.
    const total = await Movie.countDocuments(filter);

    // Общее количество страниц.
    const totalPages = Math.ceil(total / limitNumber);

    // Получаем фильмы с учетом фильтрации, сортировки и пагинации.
    const movies = await Movie.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);

    res.status(200).json({
        total,
        totalPages,
        page: pageNumber,
        limit: limitNumber,
        movies,
    });
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