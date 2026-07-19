/*
Validate Movie Middleware

Проверяет данные фильма перед выполнением контроллера.
- Проверяет req.body по правилам Joi.
- Если есть ошибки — возвращает 400 Bad Request.
- Если данные корректны — вызывает next().
*/

// Request -> authMiddleware -> adminMiddleware -> validateMovie -> movieController

const movieSchema = require("../validations/movieValidation");

const validateMovie = (req, res, next) => {
    // movieSchema находится в папке validations.
    const { error } = movieSchema.validate(req.body, {
        abortEarly: false, //позволяет собрать все ошибки сразу
    });

    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            // Преобразуем массив объектов ошибок Joi, в массив строк с понятными сообщениями.
            errors: error.details.map((detail) => detail.message),
        });
    }

    next();
};

module.exports = validateMovie;