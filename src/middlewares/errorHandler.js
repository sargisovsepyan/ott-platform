const errorHandler = (error, req, res, next) => {//отвечает клиенту 
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        message: error.message || "Internal server error",
    });
};

module.exports = errorHandler;