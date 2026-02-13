import { Router } from "express";
import { ExplorersController } from "@/modules/explorers/application/controllers/explorers.controller";
import { ExplorersValidator } from "@/modules/explorers/application/validators/explorers.validator";
import { validateRequest } from "@/shared/application/validators/validation.middleware";
import { isAuthenticated, isAuthorized } from "@/shared/infrastructure/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/explorers:
 *   get:
 *     summary: Listar exploradores
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de exploradores
 */
router.get("/", isAuthenticated, isAuthorized("explorers", "read"), ExplorersController.findAll);

/**
 * @swagger
 * /api/explorers/guardians:
 *   get:
 *     summary: Listar acudientes de exploradores
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/guardians",
  isAuthenticated,
  isAuthorized("explorers", "read"),
  ExplorersController.findAllGuardians
);

/**
 * @swagger
 * /api/explorers/guardians/{id}:
 *   get:
 *     summary: Obtener acudiente por id
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/guardians/:id",
  isAuthenticated,
  isAuthorized("explorers", "read"),
  ExplorersValidator.idParam(),
  validateRequest,
  ExplorersController.findGuardianById
);

/**
 * @swagger
 * /api/explorers/guardians:
 *   post:
 *     summary: Crear acudiente
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/guardians",
  isAuthenticated,
  isAuthorized("explorers", "create"),
  ExplorersValidator.createGuardian(),
  validateRequest,
  ExplorersController.createGuardian
);

/**
 * @swagger
 * /api/explorers/guardians/{id}:
 *   put:
 *     summary: Actualizar acudiente
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/guardians/:id",
  isAuthenticated,
  isAuthorized("explorers", "update"),
  ExplorersValidator.updateGuardian(),
  validateRequest,
  ExplorersController.updateGuardian
);

/**
 * @swagger
 * /api/explorers/guardians/{id}:
 *   delete:
 *     summary: Eliminar acudiente
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/guardians/:id",
  isAuthenticated,
  isAuthorized("explorers", "delete"),
  ExplorersValidator.idParam(),
  validateRequest,
  ExplorersController.removeGuardian
);

/**
 * @swagger
 * /api/explorers/{id}:
 *   get:
 *     summary: Obtener explorador por id
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("explorers", "read"),
  ExplorersValidator.idParam(),
  validateRequest,
  ExplorersController.findById
);

/**
 * @swagger
 * /api/explorers:
 *   post:
 *     summary: Crear explorador con acudiente
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  isAuthenticated,
  isAuthorized("explorers", "create"),
  ExplorersValidator.create(),
  validateRequest,
  ExplorersController.create
);

/**
 * @swagger
 * /api/explorers/{id}:
 *   put:
 *     summary: Actualizar explorador
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("explorers", "update"),
  ExplorersValidator.update(),
  validateRequest,
  ExplorersController.update
);

/**
 * @swagger
 * /api/explorers/{id}:
 *   delete:
 *     summary: Eliminar explorador
 *     tags: [Explorers]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("explorers", "delete"),
  ExplorersValidator.idParam(),
  validateRequest,
  ExplorersController.remove
);

export default router;
