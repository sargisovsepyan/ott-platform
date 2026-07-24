const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 150,
        },

        year: {
            type: Number,
            required: true,
            min: 1888,
            max: new Date().getFullYear() + 5,//которые выйдут в ближайшие 5лет
        },

        genre: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 2000,
        },

        rating: {
            type: Number,
            min: 0,
            max: 10,
            default: 0,
        },
        poster: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,//дата создания, посл. изменения
    }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
