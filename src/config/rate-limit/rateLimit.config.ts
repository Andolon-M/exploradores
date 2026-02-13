import rateLimit from "express-rate-limit";
import { Request } from "express";

const extractRealIP = (req: Request): string => {
  const header = req.headers["x-forwarded-for"];
  if (typeof header === "string") {
    const first = header.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.ip || req.socket.remoteAddress || "unknown";
};

const buildLimiter = (windowMs: number, max: number, message: string) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator: extractRealIP,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      message
    }
  });

export const generalLimiter = buildLimiter(
  Number(process.env.GENERAL_RATE_LIMIT_WINDOW_MS || 900000),
  Number(process.env.GENERAL_RATE_LIMIT_MAX || 100),
  "Demasiadas peticiones, intenta nuevamente mas tarde."
);

export const authLimiter = buildLimiter(
  Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 60000),
  Number(process.env.AUTH_RATE_LIMIT_MAX || 5),
  "Demasiados intentos de autenticacion, intenta nuevamente."
);

export const sensitiveApiLimiter = buildLimiter(
  Number(process.env.SENSITIVE_RATE_LIMIT_WINDOW_MS || 60000),
  Number(process.env.SENSITIVE_RATE_LIMIT_MAX || 30),
  "Demasiadas peticiones al endpoint sensible."
);
