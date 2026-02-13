import { body, param } from "express-validator";

export class ExplorersValidator {
  static idParam() {
    return [param("id").isInt({ min: 1 }).withMessage("ID invalido")];
  }

  static create() {
    return [
      body("dni_type").isIn(["DNI", "CE", "TI", "OTHER"]).withMessage("dni_type invalido"),
      body("dni_type_other")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("dni_type_other invalido"),
      body("dni").isString().notEmpty().withMessage("El DNI es requerido"),
      body("first_name").optional().isString().notEmpty().withMessage("El nombre es invalido"),
      body("last_name").optional().isString().notEmpty().withMessage("El apellido es invalido"),
      body("member_id").optional().isString().notEmpty().withMessage("member_id invalido"),
      body("phone").optional().isString().notEmpty().withMessage("phone invalido"),
      body("gender")
        .optional()
        .isIn(["MASCULINO", "FEMENINO"])
        .withMessage("Genero invalido"),
      body("guardian").isObject().withMessage("guardian es requerido"),
      body("guardian.first_name")
        .isString()
        .notEmpty()
        .withMessage("El nombre del acudiente es requerido"),
      body("guardian.last_name")
        .isString()
        .notEmpty()
        .withMessage("El apellido del acudiente es requerido"),
      body("guardian.dni_type")
        .isIn(["DNI", "CE", "TI", "OTHER"])
        .withMessage("dni_type del acudiente invalido"),
      body("guardian.dni_type_other")
        .optional()
        .isString()
        .notEmpty()
        .withMessage("dni_type_other del acudiente invalido"),
      body("guardian.dni").isString().notEmpty().withMessage("El DNI del acudiente es requerido"),
      body("guardian.phone")
        .isString()
        .notEmpty()
        .withMessage("El telefono del acudiente es requerido"),
      body("guardian.member_id").optional().isString().notEmpty()
    ];
  }

  static update() {
    return [
      ...ExplorersValidator.idParam(),
      body("dni_type").optional().isIn(["DNI", "CE", "TI", "OTHER"]),
      body("dni_type_other").optional().isString().notEmpty(),
      body("dni").optional().isString().notEmpty(),
      body("first_name").optional().isString().notEmpty(),
      body("last_name").optional().isString().notEmpty(),
      body("member_id").optional({ nullable: true }).isString(),
      body("phone").optional({ nullable: true }).isString(),
      body("gender").optional().isIn(["MASCULINO", "FEMENINO"]),
      body("guardian").optional().isObject(),
      body("guardian.first_name").optional().isString().notEmpty(),
      body("guardian.last_name").optional().isString().notEmpty(),
      body("guardian.dni_type").optional().isIn(["DNI", "CE", "TI", "OTHER"]),
      body("guardian.dni_type_other").optional().isString().notEmpty(),
      body("guardian.dni").optional().isString().notEmpty(),
      body("guardian.phone").optional().isString().notEmpty(),
      body("guardian.member_id").optional({ nullable: true }).isString()
    ];
  }

  static createGuardian() {
    return [
      body("first_name").isString().notEmpty().withMessage("El nombre es requerido"),
      body("last_name").isString().notEmpty().withMessage("El apellido es requerido"),
      body("dni_type").isIn(["DNI", "CE", "TI", "OTHER"]).withMessage("dni_type invalido"),
      body("dni_type_other").optional().isString().notEmpty().withMessage("dni_type_other invalido"),
      body("dni").isString().notEmpty().withMessage("El DNI es requerido"),
      body("phone").isString().notEmpty().withMessage("El telefono es requerido"),
      body("member_id").optional().isString().notEmpty().withMessage("member_id invalido")
    ];
  }

  static updateGuardian() {
    return [
      ...ExplorersValidator.idParam(),
      body("first_name").optional().isString().notEmpty(),
      body("last_name").optional().isString().notEmpty(),
      body("dni_type").optional().isIn(["DNI", "CE", "TI", "OTHER"]),
      body("dni_type_other").optional().isString().notEmpty(),
      body("dni").optional().isString().notEmpty(),
      body("phone").optional().isString().notEmpty(),
      body("member_id").optional({ nullable: true }).isString()
    ];
  }
}
