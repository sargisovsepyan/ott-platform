const jwt = require("jsonwebtoken");

// Создаёт JWT-токен с ID и ролью пользователя.
const generateToken = (userId, role) => {
    if (!process.env.JWT_SECRET) {// Проверяем, что секретный ключ указан в .env.
        throw new Error("JWT_SECRET is not configured");
    }

    // Создаём и подписываем JWT-токен.
    return jwt.sign(
        {
            // Данные, которые будут сохранены внутри токена.
            id: userId,
            role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",//время жизни токена
        }
    );
};

module.exports = generateToken;
