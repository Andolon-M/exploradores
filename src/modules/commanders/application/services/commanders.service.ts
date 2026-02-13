import { CommandersRepository } from "@/modules/commanders/infrastructure/repositories/commanders.repository";
import { serializeBigInt } from "@/shared/infrastructure/utils/serializeBigInt";

export class CommandersService {
  static async findAll() {
    const data = await CommandersRepository.findAll();
    return { status: 200, message: "Comandantes obtenidos", data: serializeBigInt(data) };
  }

  static async findById(id: string) {
    const commander = await CommandersRepository.findById(BigInt(id));
    if (!commander) return { status: 404, message: "Comandante no encontrado" };
    return { status: 200, message: "Comandante obtenido", data: serializeBigInt(commander) };
  }

  static async create(body: any) {
    const created = await CommandersRepository.create({
      dni: body.dni,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone
    });
    return { status: 201, message: "Comandante creado", data: serializeBigInt(created) };
  }

  static async update(id: string, body: any) {
    const exists = await CommandersRepository.findById(BigInt(id));
    if (!exists) return { status: 404, message: "Comandante no encontrado" };

    const updated = await CommandersRepository.update(BigInt(id), {
      dni: body.dni,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone
    });

    return { status: 200, message: "Comandante actualizado", data: serializeBigInt(updated) };
  }

  static async remove(id: string) {
    const exists = await CommandersRepository.findById(BigInt(id));
    if (!exists) return { status: 404, message: "Comandante no encontrado" };
    await CommandersRepository.softDelete(BigInt(id));
    return { status: 200, message: "Comandante eliminado" };
  }
}
