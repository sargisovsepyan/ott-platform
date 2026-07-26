const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
    getUsers,
    deleteUser,
} = require("../controllers/adminUserController");

const router = express.Router();

// Все маршруты этого файла доступны только администратору.
router.use(authMiddleware, adminMiddleware);

// Возвращает список пользователей с поиском, фильтром и пагинацией.
router.get("/", getUsers);

// Удаляет пользователя по ID.
router.delete("/:id", deleteUser);

module.exports = router;