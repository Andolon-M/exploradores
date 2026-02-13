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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dni, dni_type, first_name, last_name, cell, phone]
 *             properties:
 *               dni:
 *                 type: string
 *               dni_type:
 *                 type: string
 *                 enum: [DNI, CE, TI, OTHER]
 *               dni_type_other:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               cell:
 *                 type: string
 *               phone:
 *                 type: string
 *               member_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO]
 *           example:
 *             dni: "12345678"
 *             dni_type: "DNI"
 *             first_name: "Carlos"
 *             last_name: "Perez"
 *             cell: "3001234567"
 *             phone: "6011234567"
 *             member_id: "M-2045"
 *             status: "ACTIVO"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               dni_type:
 *                 type: string
 *                 enum: [DNI, CE, TI, OTHER]
 *               dni_type_other:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               cell:
 *                 type: string
 *               phone:
 *                 type: string
 *               member_id:
 *                 type: string
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum: [ACTIVO, INACTIVO]
 *           example:
 *             phone: "6017654321"
 *             status: "ACTIVO"
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
