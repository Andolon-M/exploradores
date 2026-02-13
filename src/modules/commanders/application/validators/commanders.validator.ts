import { body, param } from "express-validator";

export class CommandersValidator {
  static idParam() {
    return [param("id").isInt({ min: 1 }).withMessage("ID invalido")];
  }

  static create() {
    return [
      body("dni").isString().notEmpty().withMessage("El DNI es requerido"),
      body("dni_type").isIn(["DNI", "CE", "TI", "OTHER"]).withMessage("dni_type invalido"),
      body("dni_type_other")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("dni_type_other invalido"),
      body("first_name").isString().notEmpty().withMessage("El nombre es requerido"),
      body("last_name").isString().notEmpty().withMessage("El apellido es requerido"),
      body("cell").isString().notEmpty().withMessage("El celular es requerido"),
      body("phone").isString().notEmpty().withMessage("El telefono es requerido"),
      body("member_id").optional().isString(),
      body("status").optional().isIn(["ACTIVO", "INACTIVO"]).withMessage("status invalido")
    ];
  }

  static update() {
    return [
      ...CommandersValidator.idParam(),
      body("dni").optional().isString().notEmpty(),
      body("dni_type").optional().isIn(["DNI", "CE", "TI", "OTHER"]),
      body("dni_type_other").optional().isString().notEmpty(),
      body("first_name").optional().isString().notEmpty(),
      body("last_name").optional().isString().notEmpty(),
      body("cell").optional().isString().notEmpty(),
      body("phone").optional().isString().notEmpty(),
      body("member_id").optional({ nullable: true }).isString(),
      body("status").optional().isIn(["ACTIVO", "INACTIVO"])
    ];
  }
}
