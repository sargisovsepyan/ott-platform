const express = require("express");

const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "OTT Backend API is running",
    });
});

module.exports = app;