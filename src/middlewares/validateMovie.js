/*
Validate Movie Middleware

Проверяет данные фильма перед выполнением контроллера.
- Проверяет req.body по правилам Joi.
- Если есть ошибки — возвращает 400 Bad Request.
- Если данные корректны — вызывает next().
*/

// Request -> authMiddleware -> adminMiddleware -> validateMovie -> movieController

const {
    createMovieSchema,
    updateMovieSchema,
} = require("../validations/movieValidation");

const validateMovie = (req, res, next) => {
    const schema =
        req.method === "PATCH" ? updateMovieSchema : createMovieSchema;

    const { error } = schema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    next();
};

module.exports = validateMovie;