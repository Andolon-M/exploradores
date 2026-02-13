import { Gender } from "@prisma/client";
import { ExplorersRepository } from "@/modules/explorers/infrastructure/repositories/explorers.repository";
import { serializeBigInt } from "@/shared/infrastructure/utils/serializeBigInt";

export class ExplorersService {
  static async findAll() {
    const data = await ExplorersRepository.findAll();
    return { status: 200, message: "Exploradores obtenidos", data: serializeBigInt(data) };
  }

  static async findById(id: string) {
    const explorer = await ExplorersRepository.findById(BigInt(id));
    if (!explorer) return { status: 404, message: "Explorador no encontrado" };
    return { status: 200, message: "Explorador obtenido", data: serializeBigInt(explorer) };
  }

  static async create(body: any) {
    const created = await ExplorersRepository.create({
      first_name: body.first_name,
      last_name: body.last_name,
      dni: body.dni,
      birthdate: body.birthdate ? new Date(body.birthdate) : undefined,
      gender: body.gender as Gender | undefined,
      guardian_name: body.guardian_name,
      guardian_phone: body.guardian_phone,
      commander_id: body.commander_id ? BigInt(body.commander_id) : undefined
    });
    return { status: 201, message: "Explorador creado", data: serializeBigInt(created) };
  }

  static async update(id: string, body: any) {
    const exists = await ExplorersRepository.findById(BigInt(id));
    if (!exists) return { status: 404, message: "Explorador no encontrado" };

    const updated = await ExplorersRepository.update(BigInt(id), {
      first_name: body.first_name,
      last_name: body.last_name,
      dni: body.dni,
      birthdate: body.birthdate ? new Date(body.birthdate) : undefined,
      gender: body.gender as Gender | undefined,
      guardian_name: body.guardian_name,
      guardian_phone: body.guardian_phone,
      commander_id:
        body.commander_id === null || body.commander_id === ""
          ? null
          : body.commander_id
            ? BigInt(body.commander_id)
            : undefined
    });

    return { status: 200, message: "Explorador actualizado", data: serializeBigInt(updated) };
  }

  static async remove(id: string) {
    const exists = await ExplorersRepository.findById(BigInt(id));
    if (!exists) return { status: 404, message: "Explorador no encontrado" };
    await ExplorersRepository.softDelete(BigInt(id));
    return { status: 200, message: "Explorador eliminado" };
  }
}
