const Movie = require("../models/Movie");
const HomepageConfig = require("../models/HomepageConfig");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const serializeMovie = require("../utils/serializeMovie");

// Создаёт новый фильм в базе данных
const createMovie = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Poster is required",
        });
    }

    const movieData = {
        ...req.body,
        poster: req.file.path,
    };

    const movie = await Movie.create(movieData);

    res.status(201).json(serializeMovie(movie));
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
        movies: movies.map((movie) => serializeMovie(movie)),
    });
});

// Ищет фильм по ID
const getMovieById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    res.status(200).json(serializeMovie(movie));
});

// Обновляет переданные поля фильма.
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

    res.status(200).json(serializeMovie(updatedMovie));
});

// Обновляет постер фильма.
const updateMoviePoster = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({
            message: "Poster is required",
        });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        {
            poster: req.file.path,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedMovie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    res.status(200).json(serializeMovie(updatedMovie));
});

// Загружает или заменяет превью-видео фильма.
const updateMovieVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({
            message: "Movie video is required",
        });
    }

    const uploadedPublicId = req.file.filename;

    const movie = await Movie.findById(id);

    if (!movie) {
        try {
            await cloudinary.uploader.destroy(uploadedPublicId, {
                resource_type: "video",
            });
        } catch (error) {
            console.error("Failed to delete uploaded video:", error.message);
        }

        return res.status(404).json({
            message: "Movie not found",
        });
    }

    const previousPublicId = movie.video?.publicId;

    movie.video = {
        url: req.file.path,
        publicId: uploadedPublicId,
        format: "mp4",
    };

    try {
        await movie.save();
    } catch (error) {
        try {
            await cloudinary.uploader.destroy(uploadedPublicId, {
                resource_type: "video",
            });
        } catch (cleanupError) {
            console.error(
                "Failed to delete uploaded video:",
                cleanupError.message
            );
        }

        throw error;
    }

    if (previousPublicId && previousPublicId !== uploadedPublicId) {
        try {
            await cloudinary.uploader.destroy(previousPublicId, {
                resource_type: "video",
            });
        } catch (error) {
            console.error(
                "Failed to delete previous video:",
                error.message
            );
        }
    }

    res.status(200).json(serializeMovie(movie));
});

// Удаляет индивидуальное превью-видео фильма.
const deleteMovieVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    const videoPublicId = movie.video?.publicId;

    if (!videoPublicId) {
        return res.status(400).json({
            message: "Movie does not have a custom movie video",
        });
    }

    movie.video = undefined;

    await movie.save();

    try {
        await cloudinary.uploader.destroy(videoPublicId, {
            resource_type: "video",
        });
    } catch (error) {
        console.error(
            "Failed to delete movie video from Cloudinary:",
            error.message
        );
    }

    res.status(200).json(serializeMovie(movie));
});

// Удаляет фильм по ID.
const deleteMovie = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
        return res.status(404).json({
            message: "Movie not found",
        });
    }

    // Удаляем фильм из настроек главной страницы,
    // если администратор ранее выбрал его для показа.
    const homepageConfig = await HomepageConfig.findOne({
        key: "main",
    });

    if (homepageConfig) {
        const remainingMovieIds = homepageConfig.movieIds.filter(
            (movieId) => movieId.toString() !== id
        );

        const movieWasOnHomepage =
            remainingMovieIds.length !== homepageConfig.movieIds.length;

        if (movieWasOnHomepage) {
            // Если выбранных фильмов больше не осталось,
            // удаляем конфигурацию и возвращаем стандартный список фильмов.
            if (remainingMovieIds.length === 0) {
                await HomepageConfig.deleteOne({
                    _id: homepageConfig._id,
                });
            } else {
                homepageConfig.movieIds = remainingMovieIds;

                // Количество отображаемых фильмов не может быть
                // больше количества оставшихся выбранных фильмов.
                homepageConfig.displayCount = Math.min(
                    homepageConfig.displayCount,
                    remainingMovieIds.length
                );

                await homepageConfig.save();
            }
        }
    }

    // Удаляем загруженное видео фильма из Cloudinary.
    const videoPublicId = deletedMovie.video?.publicId;

    if (videoPublicId) {
        try {
            await cloudinary.uploader.destroy(videoPublicId, {
                resource_type: "video",
            });
        } catch (error) {
            console.error(
                "Failed to delete movie video:",
                error.message
            );
        }
    }

    return res.status(200).json({
        message: "Movie deleted successfully",
    });
});

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    updateMoviePoster,
    updateMovieVideo,
    deleteMovieVideo,
    deleteMovie,
};