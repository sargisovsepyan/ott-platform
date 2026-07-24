const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

/*
 Регистрация пользователя
 Создаёт нового пользователя:
 1. Проверяет обязательные поля.
 2. Проверяет, что email ещё не зарегистрирован.
 3. Хэширует пароль.
 4. Сохраняет пользователя в базу данных.
 5. Возвращает безопасные данные без пароля.
*/
const register = asyncHandler(async (req, res) => {
    // Получаем данные из тела HTTP-запроса
    const { name, email, password } = req.body;

    // Проверяем, что пользователь отправил обязательные поля
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required",
        });
    }

    // Приводим email к единому виду
    const normalizedEmail = email.trim().toLowerCase();

    // Ищем пользователя с таким email
    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    // Если пользователь уже существует — регистрацию запрещаем
    if (existingUser) {
        return res.status(409).json({
            message: "User already exists",
        });
    }

    // Хэшируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
    });

    // Возвращаем только безопасные данные
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
});

/*

 Авторизация пользователя
 Проверяет данные пользователя:
 1. Проверяет обязательные поля.
 2. Находит пользователя по email.
 3. Проверяет пароль.
 4. Создаёт JWT-токен.
 5. Возвращает пользователя и токен.
*/
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Проверяем обязательные поля
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    // Приводим email к единому формату
    const normalizedEmail = email.trim().toLowerCase();

    // Ищем пользователя в базе данных
    const user = await User.findOne({
        email: normalizedEmail,
    });

    // Если пользователь не найден — возвращаем ошибку
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    // Сравниваем введённый пароль с хэшем, который хранится в базе данных
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Если пароль неверный — доступ запрещён
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid email or password",
        });
    }

    // Генерируем JWT-токен, внутрь токена помещаем id и роль пользователя.
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
});

module.exports = {
    register,
    login,
};