//Описывает правила валидации данных фильма с помощью Joi.
// Request -> Joi movieSchema -> movieValidate -> movieController
const Joi = require("joi");

// Создаём схему валидации для входящих данных фильма.
const movieSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(150)
        .required(),

    year: Joi.number()
        .min(1888)
        .max(new Date().getFullYear() + 5)
        .required(),

    genre: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .trim()
        .max(2000),

    rating: Joi.number()
        .min(0)
        .max(10),
});

module.exports = movieSchema;