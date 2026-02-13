import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/application/services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await AuthService.register(email, password);
    res.status(result.status).json(result);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(result.status).json(result);
  }

  static async me(req: Request, res: Response) {
    const userId = req.user?.userId as string;
    const result = await AuthService.me(userId);
    res.status(result.status).json(result);
  }
}
