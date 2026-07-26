// Контроллер управляет фильмами, которые отображаются на главной странице.
//
// Публичный маршрут возвращает фильмы для главной страницы.
// Административные маршруты позволяют получить и изменить конфигурацию.

const HomepageConfig = require("../models/HomepageConfig");
const Movie = require("../models/Movie");
const serializeMovie = require("../utils/serializeMovie");

// Ключ единственной основной конфигурации главной страницы.
const HOMEPAGE_CONFIG_KEY = "main";

// Количество фильмов до первой настройки администратором.
const DEFAULT_DISPLAY_COUNT = 5;

// Получает фильмы из MongoDB и возвращает их в том порядке,
// в котором администратор указал их ID в конфигурации.
const getMoviesInConfiguredOrder = async (movieIds) => {
    const movies = await Movie.find({
        _id: {
            $in: movieIds,
        },
    }).lean();

    // Создаём удобную таблицу: ID фильма → объект фильма.
    const moviesById = new Map(
        movies.map((movie) => [movie._id.toString(), movie])
    );

    // Восстанавливаем порядок, который выбрал администратор.
    // Несуществующие фильмы пропускаются.
    return movieIds
        .map((movieId) => moviesById.get(movieId.toString()))
        .filter(Boolean);
};

// Публичный контроллер: возвращает фильмы для главной страницы.
const getHomepage = async (req, res, next) => {
    try {
        const config = await HomepageConfig.findOne({
            key: HOMEPAGE_CONFIG_KEY,
        }).lean();

        // Пока администратор не создал конфигурацию,
        // показываем последние добавленные фильмы.
        if (!config) {
            const latestMovies = await Movie.find()
                .sort({
                    createdAt: -1,
                })
                .limit(DEFAULT_DISPLAY_COUNT)
                .lean();

            return res.status(200).json({
                displayCount: latestMovies.length,
                movies: latestMovies.map(serializeMovie),
            });
        }

        const orderedMovies = await getMoviesInConfiguredOrder(
            config.movieIds
        );

        // Оставляем только выбранное администратором количество фильмов.
        const visibleMovies = orderedMovies.slice(
            0,
            config.displayCount
        );

        return res.status(200).json({
            displayCount: visibleMovies.length,
            movies: visibleMovies.map(serializeMovie),
        });
    } catch (error) {
        return next(error);
    }
};

// Администратор: возвращает полную конфигурацию главной страницы.
const getHomepageConfig = async (req, res, next) => {
    try {
        const config = await HomepageConfig.findOne({
            key: HOMEPAGE_CONFIG_KEY,
        }).lean();

        // Конфигурация ещё не была создана.
        if (!config) {
            return res.status(200).json({
                configured: false,
                movieIds: [],
                displayCount: DEFAULT_DISPLAY_COUNT,
                movies: [],
            });
        }

        const orderedMovies = await getMoviesInConfiguredOrder(
            config.movieIds
        );

        return res.status(200).json({
            configured: true,
            movieIds: config.movieIds.map((movieId) =>
                movieId.toString()
            ),
            displayCount: config.displayCount,
            movies: orderedMovies.map(serializeMovie),
        });
    } catch (error) {
        return next(error);
    }
};

// Администратор: создаёт или полностью заменяет конфигурацию.
const updateHomepageConfig = async (req, res, next) => {
    try {
        const { movieIds, displayCount } = req.body;

        // Проверяем, что все выбранные фильмы существуют.
        const existingMovies = await Movie.find({
            _id: {
                $in: movieIds,
            },
        })
            .select("_id")
            .lean();

        const existingMovieIds = new Set(
            existingMovies.map((movie) => movie._id.toString())
        );

        // Находим ID фильмов, которых нет в базе данных.
        const missingMovieIds = movieIds.filter(
            (movieId) => !existingMovieIds.has(movieId)
        );

        if (missingMovieIds.length > 0) {
            return res.status(400).json({
                message: "Some selected movies do not exist",
                missingMovieIds,
            });
        }

        // Создаём конфигурацию при первом запросе
        // или обновляем уже существующую.
        const config = await HomepageConfig.findOneAndUpdate(
            {
                key: HOMEPAGE_CONFIG_KEY,
            },
            {
                $set: {
                    movieIds,
                    displayCount,
                },
                $setOnInsert: {
                    key: HOMEPAGE_CONFIG_KEY,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).lean();

        const orderedMovies = await getMoviesInConfiguredOrder(
            config.movieIds
        );

        return res.status(200).json({
            configured: true,
            movieIds: config.movieIds.map((movieId) =>
                movieId.toString()
            ),
            displayCount: config.displayCount,
            movies: orderedMovies.map(serializeMovie),
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getHomepage,
    getHomepageConfig,
    updateHomepageConfig,
};