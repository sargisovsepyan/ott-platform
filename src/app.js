const express = require("express");

// Создаём приложение Express
const app = express();

// Разрешаем серверу принимать JSON
app.use(express.json());

// Временный маршрут
app.get("/", (req, res) => {
    res.send("OTT Backend is running!");
});

// Экспортируем приложение
module.exports = app;