const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    // Отдельная защита входа и регистрации.
    limit: 30,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    // Не учитываем служебные CORS-запросы.
    skip: (req) => req.method === "OPTIONS",

    message: {
        message: "Too many authentication attempts, please try again later.",
    },
});

module.exports = authLimiter;