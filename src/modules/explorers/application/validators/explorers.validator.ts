import { body, param } from "express-validator";

export class ExplorersValidator {
  static idParam() {
    return [param("id").isInt({ min: 1 }).withMessage("ID invalido")];
  }

  static create() {
    return [
      body("first_name").isString().notEmpty().withMessage("El nombre es requerido"),
      body("gender")
        .optional()
        .isIn(["MASCULINO", "FEMENINO"])
        .withMessage("Genero invalido"),
      body("commander_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("commander_id invalido")
    ];
  }

  static update() {
    return [
      ...ExplorersValidator.idParam(),
      body("first_name").optional().isString().notEmpty(),
      body("gender").optional().isIn(["MASCULINO", "FEMENINO"]),
      body("commander_id").optional({ nullable: true }).isInt({ min: 1 })
    ];
  }
}
