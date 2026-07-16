const express = require("express");

const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    return res.json({
        status: "OK",
        message: "OTT Backend API is running",
    });
});

app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found",
    });
});

module.exports = app;
