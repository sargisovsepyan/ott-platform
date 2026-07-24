const Joi = require("joi");

// Схема Joi для проверки параметров поиска, фильтрации, сортировки и пагинации.
const movieQuerySchema = Joi.object({
    // Поиск по названию фильма.
    search: Joi.string().trim().allow(""),

    // Фильтр по году выпуска.
    year: Joi.number()
        .integer()
        .min(1888)
        .max(new Date().getFullYear() + 5),

    // Фильтр по жанру.
    genre: Joi.string().trim().allow(""),

    // Разрешенные варианты сортировки.
    sort: Joi.string().valid(
        "year",
        "-year",
        "rating",
        "-rating",
        "title",
        "-title",
    ),

    // Номер страницы.
    page: Joi.number().integer().min(1).default(1),

    // Количество фильмов на странице.
    limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = movieQuerySchema;