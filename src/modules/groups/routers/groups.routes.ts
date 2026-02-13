import { Router } from "express";
import { GroupsController } from "@/modules/groups/application/controllers/groups.controller";
import { GroupsValidator } from "@/modules/groups/application/validators/groups.validator";
import { validateRequest } from "@/shared/application/validators/validation.middleware";
import { isAuthenticated, isAuthorized } from "@/shared/infrastructure/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Listar grupos
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", isAuthenticated, isAuthorized("groups", "read"), GroupsController.findAll);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Obtener grupo por id
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("groups", "read"),
  GroupsValidator.idParam(),
  validateRequest,
  GroupsController.findById
);

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Crear grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               is_explorer:
 *                 type: boolean
 *           example:
 *             name: "Pioneros"
 *             is_explorer: false
 */
router.post(
  "/",
  isAuthenticated,
  isAuthorized("groups", "create"),
  GroupsValidator.create(),
  validateRequest,
  GroupsController.create
);

/**
 * @swagger
 * /api/groups/{id}:
 *   put:
 *     summary: Actualizar grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               is_explorer:
 *                 type: boolean
 *           example:
 *             name: "Exploradores"
 *             is_explorer: true
 */
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("groups", "update"),
  GroupsValidator.update(),
  validateRequest,
  GroupsController.update
);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Eliminar grupo
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("groups", "delete"),
  GroupsValidator.idParam(),
  validateRequest,
  GroupsController.remove
);

export default router;
