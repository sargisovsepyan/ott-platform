const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    // Обычный просмотр сайта не должен быстро блокироваться.
    limit: 1000,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    // Не считаем служебные CORS-запросы браузера.
    skip: (req) => req.method === "OPTIONS",

    message: {
        message: "Too many requests, please try again later.",
    },
});

module.exports = limiter;