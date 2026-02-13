import { body, param } from "express-validator";

export class CommandersValidator {
  static idParam() {
    return [param("id").isInt({ min: 1 }).withMessage("ID invalido")];
  }

  static create() {
    return [
      body("first_name").isString().notEmpty().withMessage("El nombre es requerido"),
      body("email").optional().isEmail().withMessage("Email invalido")
    ];
  }

  static update() {
    return [
      ...CommandersValidator.idParam(),
      body("first_name").optional().isString().notEmpty(),
      body("email").optional().isEmail()
    ];
  }
}
