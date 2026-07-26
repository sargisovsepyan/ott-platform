const express = require("express");
const cors = require("cors");

const movieRoutes = require("./routes/movieRoutes");
const authRoutes = require("./routes/authRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const limiter = require("./middlewares/rateLimiter");
const authLimiter = require("./middlewares/authRateLimiter");
const morgan = require("morgan");

const app = express();

app.set("trust proxy", 1);

// Домены, которым разрешено обращаться к backend.
const allowedOrigins = (
    process.env.CLIENT_ORIGINS || "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(morgan("dev"));
app.use(limiter);
app.use(express.json());


// Подключаем Swagger UI.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authLimiter, authRoutes);
// Подключаем маршруты главной страницы.
app.use("/api/homepage", homepageRoutes);

app.use("/api/admin/users", adminUserRoutes);

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
