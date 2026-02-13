import { body } from "express-validator";

export class AuthValidator {
  static register() {
    return [
      body("email").isEmail().withMessage("Email invalido"),
      body("password")
        .isString()
        .isLength({ min: 6 })
        .withMessage("La contrasena debe tener minimo 6 caracteres")
    ];
  }

  static login() {
    return [
      body("email").isEmail().withMessage("Email invalido"),
      body("password").isString().notEmpty().withMessage("La contrasena es requerida")
    ];
  }
}
