// Описывает правила валидации данных фильма с помощью Joi.
// Request -> Joi movieSchema -> movieValidate -> movieController

const Joi = require("joi");

// Общие правила для всех полей
const movieFields = {
    title: Joi.string()
        .trim()
        .min(1)
        .max(150),

    year: Joi.number()
        .min(1888)
        .max(new Date().getFullYear() + 5),

    genre: Joi.string()
        .trim(),

    description: Joi.string()
        .trim()
        .max(2000),

    rating: Joi.number()
        .min(0)
        .max(10),
};

// Для создания фильма (POST)
const createMovieSchema = Joi.object({
    title: movieFields.title.required(),
    year: movieFields.year.required(),
    genre: movieFields.genre.required(),
    description: movieFields.description,
    rating: movieFields.rating,
});

// Для частичного обновления (PATCH)
const updateMovieSchema = Joi.object(movieFields).min(1);

module.exports = {
    createMovieSchema,
    updateMovieSchema,
};