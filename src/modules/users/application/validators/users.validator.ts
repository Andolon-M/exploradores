import { body, param } from "express-validator";

export class UsersValidator {
  static idParam() {
    return [param("id").isInt({ min: 1 }).withMessage("ID invalido")];
  }

  static create() {
    return [
      body("email").isEmail().withMessage("Email invalido"),
      body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("La contrasena debe tener minimo 6 caracteres"),
      body("role_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("role_id invalido")
    ];
  }

  static update() {
    return [
      ...UsersValidator.idParam(),
      body("email").optional().isEmail().withMessage("Email invalido"),
      body("password")
        .optional()
        .isString()
        .isLength({ min: 6 })
        .withMessage("La contrasena debe tener minimo 6 caracteres"),
      body("role_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("role_id invalido")
    ];
  }
}
