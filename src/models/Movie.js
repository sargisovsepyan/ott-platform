const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    year: {
        type: Number,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;