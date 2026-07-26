// Модель хранит настройки блока фильмов на главной странице.
// key со значением "main" позволяет хранить одну основную конфигурацию.


const mongoose = require("mongoose");

const homepageConfigSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: "main",
            immutable: true,
        },

        // Список выбранных фильмов. Порядок ID определяет порядок на главной странице.
        movieIds: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Movie",
                },
            ],
            required: true,

            validate: [
                {
                    validator: (movieIds) =>
                        movieIds.length >= 1 && movieIds.length <= 10,
                    message:
                        "Homepage must contain between 1 and 10 movies",
                },
                {
                    validator: (movieIds) => {
                        const uniqueIds = new Set(
                            movieIds.map((movieId) => movieId.toString())
                        );

                        return uniqueIds.size === movieIds.length;
                    },
                    message: "Homepage movies must be unique",
                },
            ],
        },
        // Количество выбранных фильмов, которое будет показано пользователю.
        displayCount: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
            default: 5,
        },
    },
    {
        timestamps: true,
    }
);

const HomepageConfig = mongoose.model(
    "HomepageConfig",
    homepageConfigSchema
);

module.exports = HomepageConfig;