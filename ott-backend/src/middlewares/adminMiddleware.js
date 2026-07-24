//Проверяет, что пользователь имеет роль "admin"

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied",
        });
    }

    next();
};

module.exports = adminMiddleware;