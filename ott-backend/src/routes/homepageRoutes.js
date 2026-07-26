// Маршруты для управления фильмами на главной странице.
//
// GET /api/homepage — публичный список фильмов.
// GET /api/homepage/config — конфигурация для администратора.
// PUT /api/homepage/config — сохранение конфигурации.

const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const validateHomepageConfig = require(
    "../middlewares/validateHomepageConfig"
);

const {
    getHomepage,
    getHomepageConfig,
    updateHomepageConfig,
} = require("../controllers/homepageController");

const router = express.Router();

/**
 * @swagger
 * /api/homepage:
 *   get:
 *     summary: Get homepage movies
 *     description: Returns movies selected for the homepage in the configured order.
 *     tags:
 *       - Homepage
 *     responses:
 *       200:
 *         description: Homepage movies returned successfully.
 *       500:
 *         description: Internal server error.
 */

// Публичный маршрут. Авторизация не требуется.
router.get("/", getHomepage);

/**
 * @swagger
 * /api/homepage/config:
 *   get:
 *     summary: Get homepage configuration
 *     description: Returns the complete homepage configuration. Available only to administrators.
 *     tags:
 *       - Homepage
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Homepage configuration returned successfully.
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator access is required.
 *       500:
 *         description: Internal server error.
 */

// Получение полной конфигурации доступно только администратору.
router.get(
    "/config",
    authMiddleware,
    adminMiddleware,
    getHomepageConfig
);

/**
 * @swagger
 * /api/homepage/config:
 *   put:
 *     summary: Update homepage configuration
 *     description: Selects, orders and controls how many movies appear on the homepage.
 *     tags:
 *       - Homepage
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieIds
 *               - displayCount
 *             properties:
 *               movieIds:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 10
 *                 items:
 *                   type: string
 *               displayCount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *     responses:
 *       200:
 *         description: Homepage configuration updated successfully.
 *       400:
 *         description: Validation failed or a selected movie does not exist.
 *       401:
 *         description: Authentication token is missing or invalid.
 *       403:
 *         description: Administrator access is required.
 *       500:
 *         description: Internal server error.
 */

// Сохранять настройки может только администратор.
// Перед контроллером данные проверяются через Joi.
router.put(
    "/config",
    authMiddleware,
    adminMiddleware,
    validateHomepageConfig,
    updateHomepageConfig
);

module.exports = router;