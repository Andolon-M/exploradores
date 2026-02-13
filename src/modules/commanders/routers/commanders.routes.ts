import { Router } from "express";
import { CommandersController } from "@/modules/commanders/application/controllers/commanders.controller";
import { CommandersValidator } from "@/modules/commanders/application/validators/commanders.validator";
import { validateRequest } from "@/shared/application/validators/validation.middleware";
import { isAuthenticated, isAuthorized } from "@/shared/infrastructure/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/commanders:
 *   get:
 *     summary: Listar comandantes
 *     tags: [Commanders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", isAuthenticated, isAuthorized("commanders", "read"), CommandersController.findAll);

/**
 * @swagger
 * /api/commanders/{id}:
 *   get:
 *     summary: Obtener comandante por id
 *     tags: [Commanders]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("commanders", "read"),
  CommandersValidator.idParam(),
  validateRequest,
  CommandersController.findById
);

/**
 * @swagger
 * /api/commanders:
 *   post:
 *     summary: Crear comandante
 *     tags: [Commanders]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  isAuthenticated,
  isAuthorized("commanders", "create"),
  CommandersValidator.create(),
  validateRequest,
  CommandersController.create
);

/**
 * @swagger
 * /api/commanders/{id}:
 *   put:
 *     summary: Actualizar comandante
 *     tags: [Commanders]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("commanders", "update"),
  CommandersValidator.update(),
  validateRequest,
  CommandersController.update
);

/**
 * @swagger
 * /api/commanders/{id}:
 *   delete:
 *     summary: Eliminar comandante
 *     tags: [Commanders]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("commanders", "delete"),
  CommandersValidator.idParam(),
  validateRequest,
  CommandersController.remove
);

export default router;
