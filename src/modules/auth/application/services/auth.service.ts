import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { AuthRepository } from "@/modules/auth/infrastructure/repositories/auth.repository";
import { serializeBigInt } from "@/shared/infrastructure/utils/serializeBigInt";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_this";
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION || "24h") as SignOptions["expiresIn"];

export class AuthService {
  static async register(email: string, password: string) {
    const existing = await AuthRepository.findUserByEmail(email);
    if (existing) {
      return {
        status: 409,
        message: "El correo ya esta registrado"
      };
    }

    const role = await AuthRepository.getOrCreateAdminRole();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthRepository.createUser({
      email,
      password: hashedPassword,
      role_id: role.id
    });

    return {
      status: 201,
      message: "Usuario registrado correctamente",
      data: serializeBigInt(user)
    };
  }

  static async login(email: string, password: string) {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      return { status: 401, message: "Credenciales invalidas" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { status: 401, message: "Credenciales invalidas" };
    }

    const token = jwt.sign({ userId: user.id.toString() }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION
    });

    return {
      status: 200,
      message: "Login exitoso",
      data: {
        token,
        user: serializeBigInt(user)
      }
    };
  }

  static async me(userId: string) {
    const user = await AuthRepository.getUserWithPermissions(BigInt(userId));
    if (!user) {
      return { status: 404, message: "Usuario no encontrado" };
    }

    return {
      status: 200,
      message: "Perfil obtenido",
      data: serializeBigInt(user)
    };
  }
}
