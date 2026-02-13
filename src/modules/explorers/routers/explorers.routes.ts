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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, dni_type, dni, phone]
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               dni_type:
 *                 type: string
 *                 enum: [DNI, CE, TI, OTHER]
 *               dni_type_other:
 *                 type: string
 *               dni:
 *                 type: string
 *               phone:
 *                 type: string
 *               member_id:
 *                 type: string
 *           example:
 *             first_name: "Maria"
 *             last_name: "Gomez"
 *             dni_type: "DNI"
 *             dni: "99988877"
 *             phone: "3008887766"
 *             member_id: "A-1001"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               dni_type:
 *                 type: string
 *                 enum: [DNI, CE, TI, OTHER]
 *               dni_type_other:
 *                 type: string
 *               dni:
 *                 type: string
 *               phone:
 *                 type: string
 *               member_id:
 *                 type: string
 *                 nullable: true
 *           example:
 *             phone: "3010001122"
 *             member_id: null
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dni_type, dni, guardian]
 *             properties:
 *               dni_type:
 *                 type: string
 *                 enum: [DNI, CE, TI, OTHER]
 *               dni_type_other:
 *                 type: string
 *               dni:
 *                 type: string
 *               member_id:
 *                 type: string
 *               phone:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MASCULINO, FEMENINO]
 *               guardian:
 *                 type: object
 *                 required: [first_name, last_name, dni_type, dni, phone]
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   dni_type:
 *                     type: string
 *                     enum: [DNI, CE, TI, OTHER]
 *                   dni_type_other:
 *                     type: string
 *                   dni:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   member_id:
 *                     type: string
 *           example:
 *             dni_type: "TI"
 *             dni: "10223344"
 *             first_name: "Juan"
 *             last_name: "Lopez"
 *             birthdate: "2014-06-10"
 *             gender: "MASCULINO"
 *             guardian:
 *               first_name: "Ana"
 *               last_name: "Lopez"
 *               dni_type: "DNI"
 *               dni: "88997766"
 *               phone: "3004445566"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni_type:
 *                 type: string
 *                 enum: [DNI, CE, TI, OTHER]
 *               dni_type_other:
 *                 type: string
 *               dni:
 *                 type: string
 *               member_id:
 *                 type: string
 *                 nullable: true
 *               phone:
 *                 type: string
 *                 nullable: true
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 enum: [MASCULINO, FEMENINO]
 *                 nullable: true
 *               guardian:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   dni_type:
 *                     type: string
 *                     enum: [DNI, CE, TI, OTHER]
 *                   dni_type_other:
 *                     type: string
 *                   dni:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   member_id:
 *                     type: string
 *                     nullable: true
 *           example:
 *             phone: "3201112233"
 *             guardian:
 *               phone: "3002223344"
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
