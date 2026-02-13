import { Prisma } from "@prisma/client";
import { GroupsRepository } from "@/modules/groups/infrastructure/repositories/groups.repository";
import { serializeBigInt } from "@/shared/infrastructure/utils/serializeBigInt";

export class GroupsService {
  static async findAll() {
    const data = await GroupsRepository.findAll();
    return { status: 200, message: "Grupos obtenidos", data: serializeBigInt(data) };
  }

  static async findById(id: string) {
    const group = await GroupsRepository.findById(BigInt(id));
    if (!group) return { status: 404, message: "Grupo no encontrado" };
    return { status: 200, message: "Grupo obtenido", data: serializeBigInt(group) };
  }

  static async create(body: { name: string; is_explorer?: boolean }) {
    const exists = await GroupsRepository.findByName(body.name);
    if (exists) return { status: 409, message: "El grupo ya existe" };

    try {
      const created = await GroupsRepository.create({
        name: body.name,
        is_explorer: body.is_explorer
      });
      return { status: 201, message: "Grupo creado", data: serializeBigInt(created) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return { status: 409, message: "El grupo ya existe" };
      }
      throw error;
    }
  }

  static async update(
    id: string,
    body: {
      name?: string;
      is_explorer?: boolean;
    }
  ) {
    const targetId = BigInt(id);
    const exists = await GroupsRepository.findById(targetId);
    if (!exists) return { status: 404, message: "Grupo no encontrado" };

    if (body.name && body.name !== exists.name) {
      const nameInUse = await GroupsRepository.findByName(body.name);
      if (nameInUse && nameInUse.id !== targetId) {
        return { status: 409, message: "El grupo ya existe" };
      }
    }

    try {
      const updated = await GroupsRepository.update(targetId, body);
      return { status: 200, message: "Grupo actualizado", data: serializeBigInt(updated) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return { status: 409, message: "El grupo ya existe" };
      }
      throw error;
    }
  }

  static async remove(id: string) {
    const targetId = BigInt(id);
    const exists = await GroupsRepository.findById(targetId);
    if (!exists) return { status: 404, message: "Grupo no encontrado" };
    await GroupsRepository.softDelete(targetId);
    return { status: 200, message: "Grupo eliminado" };
  }
}
