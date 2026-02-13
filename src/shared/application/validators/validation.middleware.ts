import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      message: "Error en la validacion de datos",
      data: { errors: errors.array() }
    });
  }

  next();
};
