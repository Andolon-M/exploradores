import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@/config/database/db";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_this";

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: { id: string; name: string } | null;
      permissions: { resource: string; action: string; type: number }[];
    }

    interface Request {
      user?: User;
    }
  }
}

type JwtPayload = {
  userId: string;
};

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: 401, message: "No autenticado" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await prisma.users.findUnique({
      where: { id: BigInt(decoded.userId) },
      include: {
        role: {
          include: {
            role_has_permissions: {
              include: {
                permissions: true
              }
            }
          }
        }
      }
    });

    if (!user || user.deleted_at) {
      return res.status(403).json({ status: 403, message: "Usuario no disponible" });
    }

    req.user = {
      userId: user.id.toString(),
      email: user.email,
      role: user.role ? { id: user.role.id.toString(), name: user.role.name } : null,
      permissions:
        user.role?.role_has_permissions.map((item) => ({
          resource: item.permissions.resource,
          action: item.permissions.action,
          type: item.permissions.type
        })) || []
    };

    next();
  } catch {
    return res.status(401).json({ status: 401, message: "Token invalido o expirado" });
  }
};

export const isAuthorized = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 401, message: "No autenticado" });
    }

    const hasPermission = req.user.permissions.some(
      (permission) =>
        permission.resource === resource && permission.action === action && permission.type === 0
    );

    if (!hasPermission) {
      return res.status(403).json({
        status: 403,
        message: `No tienes permisos para ${action} ${resource}`
      });
    }

    next();
  };
};
