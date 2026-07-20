const movieQuerySchema = require("../validations/movieQueryValidation");

// Middleware для проверки query-параметров.
const validateMovieQuery = (req, res, next) => {
    // Проверяем query-параметры по схеме Joi.
    const { value, error } = movieQuerySchema.validate(req.query, {
        abortEarly: false,
    });

    // Возвращаем ошибки валидации, если параметры некорректны.
    if (error) {
        return res.status(400).json({
            message: "Invalid query parameters",
            errors: error.details.map((detail) => detail.message),
        });
    }

    // Сохраняем проверенные и преобразованные параметры.
    req.query = value;

    next();
};

module.exports = validateMovieQuery;