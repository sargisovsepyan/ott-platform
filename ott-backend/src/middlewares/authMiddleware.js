const jwt = require("jsonwebtoken");

/*
Проверяет JWT-токен пользователя.

- Получает токен из заголовка Authorization.
- Проверяет его подлинность.
- Извлекает данные пользователя из токена.
- Сохраняет их в req.user.
- Передаёт запрос следующему middleware или контроллеру.
*/
// Request -> authMiddleware (req.user = decoded) -> adminMiddleware (role === "admin") -> validateMovie -> createMovie
const authMiddleware = (req, res, next) => {
    try {

        // Получаем заголовок Authorization из HTTP-запроса
        const authHeader = req.headers.authorization;

        // Если заголовок отсутствует — пользователь не авторизован
        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
            });
        }
        // Разделяем строку "Bearer <token>" на две части.
        const [scheme, token] = authHeader.split(" ");

        // Проверям формат: Bearer <token>
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        // Проверяем подпись токена и извлекаем данные записанные при его создании 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Сохраняем в req.user, чтобы они были доступны в следующих middleware и контроллерах
        req.user = decoded;

        return next();
    } catch { // Если токен недействителен или срок его действия истёк — запрещаем доступ
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;
