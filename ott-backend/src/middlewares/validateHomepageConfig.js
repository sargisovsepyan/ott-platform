// Middleware проверяет данные конфигурации главной страницы.
// Если данные неправильные — возвращает ошибку 400.
// Если данные правильные — сохраняет проверенное значение в req.body
// и передаёт запрос следующему middleware или контроллеру.
const {
    updateHomepageConfigSchema,
} = require("../validations/homepageValidation");

// Проверяем тело запроса по Joi-схеме.
const validateHomepageConfig = (req, res, next) => {
    const { error, value } = updateHomepageConfigSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }
    // Используем очищенные и проверенные Joi данные.
    req.body = value;

    next();
};

module.exports = validateHomepageConfig;