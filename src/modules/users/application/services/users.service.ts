import bcrypt from "bcryptjs";
import { UsersRepository } from "@/modules/users/infrastructure/repositories/users.repository";
import { serializeBigInt } from "@/shared/infrastructure/utils/serializeBigInt";

const parseRoleId = (value: unknown): bigint | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return BigInt(value as string);
};

export class UsersService {
  static async findAll() {
    const data = await UsersRepository.findAll();
    return { status: 200, message: "Usuarios obtenidos", data: serializeBigInt(data) };
  }

  static async findById(id: string) {
    const user = await UsersRepository.findById(BigInt(id));
    if (!user) return { status: 404, message: "Usuario no encontrado" };
    return { status: 200, message: "Usuario obtenido", data: serializeBigInt(user) };
  }

  static async create(body: {
    email: string;
    password: string;
    role_id?: string | null;
  }) {
    const emailInUse = await UsersRepository.findByEmail(body.email);
    if (emailInUse) return { status: 409, message: "El correo ya esta registrado" };

    const roleId = parseRoleId(body.role_id);
    if (roleId) {
      const roleExists = await UsersRepository.roleExists(roleId);
      if (!roleExists) return { status: 404, message: "Rol no encontrado" };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const created = await UsersRepository.create({
      email: body.email,
      password: hashedPassword,
      role_id: roleId ?? undefined
    });

    return { status: 201, message: "Usuario creado", data: serializeBigInt(created) };
  }

  static async update(
    id: string,
    body: {
      email?: string;
      password?: string;
      role_id?: string | null;
    }
  ) {
    const targetId = BigInt(id);
    const exists = await UsersRepository.findById(targetId);
    if (!exists) return { status: 404, message: "Usuario no encontrado" };

    if (body.email && body.email !== exists.email) {
      const emailInUse = await UsersRepository.findByEmail(body.email);
      if (emailInUse && emailInUse.id !== targetId) {
        return { status: 409, message: "El correo ya esta registrado" };
      }
    }

    const roleId = parseRoleId(body.role_id);
    if (roleId) {
      const roleExists = await UsersRepository.roleExists(roleId);
      if (!roleExists) return { status: 404, message: "Rol no encontrado" };
    }

    const payload: {
      email?: string;
      password?: string;
      role_id?: bigint | null;
    } = {};

    if (body.email !== undefined) payload.email = body.email;
    if (body.password !== undefined) payload.password = await bcrypt.hash(body.password, 10);
    if (body.role_id !== undefined) payload.role_id = roleId;

    const updated = await UsersRepository.update(targetId, payload);
    return { status: 200, message: "Usuario actualizado", data: serializeBigInt(updated) };
  }

  static async remove(id: string) {
    const targetId = BigInt(id);
    const exists = await UsersRepository.findById(targetId);
    if (!exists) return { status: 404, message: "Usuario no encontrado" };
    await UsersRepository.softDelete(targetId);
    return { status: 200, message: "Usuario eliminado" };
  }
}
