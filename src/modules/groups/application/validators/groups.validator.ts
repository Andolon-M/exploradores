import { body, param } from "express-validator";

export class GroupsValidator {
  static idParam() {
    return [param("id").isInt({ min: 1 }).withMessage("ID invalido")];
  }

  static create() {
    return [
      body("name").isString().notEmpty().withMessage("El nombre es requerido"),
      body("is_explorer")
        .optional()
        .isBoolean()
        .withMessage("is_explorer debe ser booleano")
    ];
  }

  static update() {
    return [
      ...GroupsValidator.idParam(),
      body("name").optional().isString().notEmpty().withMessage("El nombre es requerido"),
      body("is_explorer")
        .optional()
        .isBoolean()
        .withMessage("is_explorer debe ser booleano")
    ];
  }
}
