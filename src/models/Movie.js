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
            max: new Date().getFullYear() + 5,
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
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
