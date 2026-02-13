import { Router } from "express";
import { UsersController } from "@/modules/users/application/controllers/users.controller";
import { UsersValidator } from "@/modules/users/application/validators/users.validator";
import { validateRequest } from "@/shared/application/validators/validation.middleware";
import { isAuthenticated, isAuthorized } from "@/shared/infrastructure/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", isAuthenticated, isAuthorized("users", "read"), UsersController.findAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("users", "read"),
  UsersValidator.idParam(),
  validateRequest,
  UsersController.findById
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  isAuthenticated,
  isAuthorized("users", "create"),
  UsersValidator.create(),
  validateRequest,
  UsersController.create
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("users", "update"),
  UsersValidator.update(),
  validateRequest,
  UsersController.update
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("users", "delete"),
  UsersValidator.idParam(),
  validateRequest,
  UsersController.remove
);

export default router;
