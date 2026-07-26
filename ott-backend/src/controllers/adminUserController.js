const mongoose = require("mongoose");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Экранирует специальные символы перед использованием поиска через RegExp.
const escapeRegExp = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Возвращает список пользователей для административной панели.
const getUsers = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const requestedLimit = Number.parseInt(req.query.limit, 10) || 10;
    const limit = Math.min(requestedLimit, 50);

    const search = req.query.search?.trim() || "";
    const role = req.query.role?.trim() || "";

    if (page < 1 || limit < 1) {
        return res.status(400).json({
            message: "Page and limit must be positive integers",
        });
    }

    if (role && !["user", "admin"].includes(role)) {
        return res.status(400).json({
            message: "Role must be user or admin",
        });
    }

    const filter = {};

    if (role) {
        filter.role = role;
    }

    if (search) {
        const safeSearch = escapeRegExp(search);

        filter.$or = [
            {
                name: {
                    $regex: safeSearch,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: safeSearch,
                    $options: "i",
                },
            },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("name email role createdAt updatedAt")
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        User.countDocuments(filter),
    ]);

    const pages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
        users,
        pagination: {
            page,
            limit,
            total,
            pages,
        },
    });
});

// Удаляет пользователя по ID.
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid user ID",
        });
    }

    const user = await User.findById(id).select(
        "name email role"
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const authenticatedUserId =
        req.user.id || req.user._id;

    // Администратор не может удалить собственный аккаунт.
    if (
        authenticatedUserId &&
        authenticatedUserId.toString() === user._id.toString()
    ) {
        return res.status(400).json({
            message: "You cannot delete your own account",
        });
    }

    // В системе всегда должен оставаться хотя бы один администратор.
    if (user.role === "admin") {
        const adminCount = await User.countDocuments({
            role: "admin",
        });

        if (adminCount <= 1) {
            return res.status(400).json({
                message: "The last administrator cannot be deleted",
            });
        }
    }

    await user.deleteOne();

    return res.status(200).json({
        message: "User deleted successfully",
        deletedUser: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

module.exports = {
    getUsers,
    deleteUser,
};