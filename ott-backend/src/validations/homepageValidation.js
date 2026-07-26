// Joi-схема проверяет настройки главной страницы перед сохранением.
// Можно выбрать от 1 до 10 уникальных фильмов.
// Каждый ID должен быть корректным MongoDB ObjectId.
// displayCount не может быть больше количества выбранных фильмов.

const Joi = require("joi");

// Формат MongoDB ObjectId: строка из 24 шестнадцатеричных символов.
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const updateHomepageConfigSchema = Joi.object({
    movieIds: Joi.array()
        .items(
            Joi.string()
                .pattern(objectIdPattern)
                .required()
                .messages({
                    "string.pattern.base":
                        "Each movie ID must be a valid MongoDB ObjectId",
                })
        )
        .min(1)
        .max(10)
        .unique()
        .required(),

    displayCount: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .required(),
    // Дополнительная проверка зависимости между двумя полями.
}).custom((value, helpers) => {
    if (value.displayCount > value.movieIds.length) {
        return helpers.message({
            custom:
                "displayCount cannot be greater than the number of selected movies",
        });
    }

    return value;
});

module.exports = {
    updateHomepageConfigSchema,
};