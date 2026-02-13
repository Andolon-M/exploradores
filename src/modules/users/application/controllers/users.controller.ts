import { Request, Response } from "express";
import { UsersService } from "@/modules/users/application/services/users.service";

export class UsersController {
  static async findAll(_req: Request, res: Response) {
    const result = await UsersService.findAll();
    res.status(result.status).json(result);
  }

  static async findById(req: Request, res: Response) {
    const result = await UsersService.findById(req.params.id);
    res.status(result.status).json(result);
  }

  static async create(req: Request, res: Response) {
    const result = await UsersService.create(req.body);
    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const result = await UsersService.update(req.params.id, req.body);
    res.status(result.status).json(result);
  }

  static async remove(req: Request, res: Response) {
    const result = await UsersService.remove(req.params.id);
    res.status(result.status).json(result);
  }
}
