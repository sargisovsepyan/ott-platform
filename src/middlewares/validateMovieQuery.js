const movieQuerySchema = require("../validations/movieQueryValidation");

// Middleware для проверки query-параметров.
const validateMovieQuery = (req, res, next) => {
    // Проверяем и преобразуем query-параметры по схеме Joi.
    const { value, error } = movieQuerySchema.validate(req.query, {
        abortEarly: false,
        convert: true,
    });

    // Возвращаем ошибки валидации, если параметры некорректны.
    if (error) {
        return res.status(400).json({
            message: "Invalid query parameters",
            errors: error.details.map((detail) => detail.message),
        });
    }

    // Сохраняем проверенные параметры отдельно.
    req.validatedQuery = value;

    next();
};

module.exports = validateMovieQuery;