import { Router } from "express";
import { AuthController } from "@/modules/auth/application/controllers/auth.controller";
import { AuthValidator } from "@/modules/auth/application/validators/auth.validator";
import { validateRequest } from "@/shared/application/validators/validation.middleware";
import { isAuthenticated } from "@/shared/infrastructure/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post("/register", AuthValidator.register(), validateRequest, AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post("/login", AuthValidator.login(), validateRequest, AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Perfil autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido
 */
router.get("/me", isAuthenticated, AuthController.me);

export default router;
