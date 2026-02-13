import { Request, Response } from "express";
import { ExplorersService } from "@/modules/explorers/application/services/explorers.service";

export class ExplorersController {
  static async findAll(_req: Request, res: Response) {
    const result = await ExplorersService.findAll();
    res.status(result.status).json(result);
  }

  static async findById(req: Request, res: Response) {
    const result = await ExplorersService.findById(req.params.id);
    res.status(result.status).json(result);
  }

  static async create(req: Request, res: Response) {
    const result = await ExplorersService.create(req.body);
    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const result = await ExplorersService.update(req.params.id, req.body);
    res.status(result.status).json(result);
  }

  static async remove(req: Request, res: Response) {
    const result = await ExplorersService.remove(req.params.id);
    res.status(result.status).json(result);
  }

  static async findAllGuardians(_req: Request, res: Response) {
    const result = await ExplorersService.findAllGuardians();
    res.status(result.status).json(result);
  }

  static async findGuardianById(req: Request, res: Response) {
    const result = await ExplorersService.findGuardianById(req.params.id);
    res.status(result.status).json(result);
  }

  static async createGuardian(req: Request, res: Response) {
    const result = await ExplorersService.createGuardian(req.body);
    res.status(result.status).json(result);
  }

  static async updateGuardian(req: Request, res: Response) {
    const result = await ExplorersService.updateGuardian(req.params.id, req.body);
    res.status(result.status).json(result);
  }

  static async removeGuardian(req: Request, res: Response) {
    const result = await ExplorersService.removeGuardian(req.params.id);
    res.status(result.status).json(result);
  }
}
