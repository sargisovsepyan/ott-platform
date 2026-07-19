/*
Error Handler
- Получает ошибку из middleware или контроллера.
- Определяет HTTP-статус ошибки.
- Отправляет клиенту понятный JSON-ответ.
*/
// asyncHandler -> передаёт ошибки через next(error).
// errorHandler -> формирует HTTP-ответ клиенту.

const errorHandler = (error, req, res, next) => {//отвечает клиенту 
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Internal server error",
    });
};

module.exports = errorHandler;