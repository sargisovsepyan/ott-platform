const express = require("express");

const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());

// Подключаем Swagger UI.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use(errorHandler);

module.exports = app;
