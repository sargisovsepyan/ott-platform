const User = require("../models/User");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверяем, что пользователь отправил обязательные поля
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        // Приводим email к единому виду
        const normalizedEmail = email.trim().toLowerCase();

        // Проверяем, существует ли пользователь с таким email
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

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
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    register,
};