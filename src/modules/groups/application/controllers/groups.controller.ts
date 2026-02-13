import { Request, Response } from "express";
import { GroupsService } from "@/modules/groups/application/services/groups.service";

export class GroupsController {
  static async findAll(_req: Request, res: Response) {
    const result = await GroupsService.findAll();
    res.status(result.status).json(result);
  }

  static async findById(req: Request, res: Response) {
    const result = await GroupsService.findById(req.params.id);
    res.status(result.status).json(result);
  }

  static async create(req: Request, res: Response) {
    const result = await GroupsService.create(req.body);
    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const result = await GroupsService.update(req.params.id, req.body);
    res.status(result.status).json(result);
  }

  static async remove(req: Request, res: Response) {
    const result = await GroupsService.remove(req.params.id);
    res.status(result.status).json(result);
  }
}
