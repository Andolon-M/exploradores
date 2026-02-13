import { Request, Response } from "express";
import { CommandersService } from "@/modules/commanders/application/services/commanders.service";

export class CommandersController {
  static async findAll(_req: Request, res: Response) {
    const result = await CommandersService.findAll();
    res.status(result.status).json(result);
  }

  static async findById(req: Request, res: Response) {
    const result = await CommandersService.findById(req.params.id);
    res.status(result.status).json(result);
  }

  static async create(req: Request, res: Response) {
    const result = await CommandersService.create(req.body);
    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const result = await CommandersService.update(req.params.id, req.body);
    res.status(result.status).json(result);
  }

  static async remove(req: Request, res: Response) {
    const result = await CommandersService.remove(req.params.id);
    res.status(result.status).json(result);
  }
}
