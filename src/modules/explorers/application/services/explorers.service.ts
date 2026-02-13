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
    const dniInUse = await ExplorersRepository.findByDni(body.dni);
    if (dniInUse) return { status: 409, message: "El explorador ya existe con ese DNI" };

    const created = await ExplorersRepository.createWithGuardian({
      explorer: {
        dni_type: body.dni_type,
        dni_type_other: body.dni_type_other,
        dni: body.dni,
        member_id: body.member_id,
        phone: body.phone,
        first_name: body.first_name,
        last_name: body.last_name,
        birthdate: body.birthdate ? new Date(body.birthdate) : undefined,
        gender: body.gender as Gender | undefined
      },
      guardian: {
        first_name: body.guardian.first_name,
        last_name: body.guardian.last_name,
        dni_type: body.guardian.dni_type,
        dni_type_other: body.guardian.dni_type_other,
        dni: body.guardian.dni,
        phone: body.guardian.phone,
        member_id: body.guardian.member_id
      }
    });
    return { status: 201, message: "Explorador creado", data: serializeBigInt(created) };
  }

  static async update(id: string, body: any) {
    const targetId = BigInt(id);
    const exists = await ExplorersRepository.findById(targetId);
    if (!exists) return { status: 404, message: "Explorador no encontrado" };

    if (body.dni && body.dni !== exists.dni) {
      const dniInUse = await ExplorersRepository.findByDni(body.dni);
      if (dniInUse && dniInUse.id !== targetId) {
        return { status: 409, message: "El explorador ya existe con ese DNI" };
      }
    }

    const updated = await ExplorersRepository.updateWithOptionalGuardian(targetId, {
      explorer: {
        dni_type: body.dni_type,
        dni_type_other: body.dni_type_other,
        dni: body.dni,
        member_id: body.member_id,
        phone: body.phone,
        first_name: body.first_name,
        last_name: body.last_name,
        birthdate:
          body.birthdate === null
            ? null
            : body.birthdate
              ? new Date(body.birthdate)
              : undefined,
        gender:
          body.gender === null
            ? null
            : body.gender
              ? (body.gender as Gender)
              : undefined
      },
      guardian: body.guardian
        ? {
            first_name: body.guardian.first_name,
            last_name: body.guardian.last_name,
            dni_type: body.guardian.dni_type,
            dni_type_other: body.guardian.dni_type_other,
            dni: body.guardian.dni,
            phone: body.guardian.phone,
            member_id:
              body.guardian.member_id === null || body.guardian.member_id === ""
                ? null
                : body.guardian.member_id
          }
        : undefined
    });

    if (!updated) return { status: 404, message: "Explorador no encontrado" };

    return { status: 200, message: "Explorador actualizado", data: serializeBigInt(updated) };
  }

  static async remove(id: string) {
    const exists = await ExplorersRepository.findById(BigInt(id));
    if (!exists) return { status: 404, message: "Explorador no encontrado" };
    await ExplorersRepository.softDelete(BigInt(id));
    return { status: 200, message: "Explorador eliminado" };
  }

  static async findAllGuardians() {
    const data = await ExplorersRepository.findAllGuardians();
    return { status: 200, message: "Acudientes obtenidos", data: serializeBigInt(data) };
  }

  static async findGuardianById(id: string) {
    const guardian = await ExplorersRepository.findGuardianById(BigInt(id));
    if (!guardian) return { status: 404, message: "Acudiente no encontrado" };
    return { status: 200, message: "Acudiente obtenido", data: serializeBigInt(guardian) };
  }

  static async createGuardian(body: any) {
    const dniInUse = await ExplorersRepository.findGuardianByDni(body.dni);
    if (dniInUse) return { status: 409, message: "El acudiente ya existe con ese DNI" };

    const created = await ExplorersRepository.createGuardian({
      first_name: body.first_name,
      last_name: body.last_name,
      dni_type: body.dni_type,
      dni_type_other: body.dni_type_other,
      dni: body.dni,
      phone: body.phone,
      member_id: body.member_id
    });

    return { status: 201, message: "Acudiente creado", data: serializeBigInt(created) };
  }

  static async updateGuardian(id: string, body: any) {
    const targetId = BigInt(id);
    const exists = await ExplorersRepository.findGuardianById(targetId);
    if (!exists) return { status: 404, message: "Acudiente no encontrado" };

    if (body.dni && body.dni !== exists.dni) {
      const dniInUse = await ExplorersRepository.findGuardianByDni(body.dni);
      if (dniInUse && dniInUse.id !== targetId) {
        return { status: 409, message: "El acudiente ya existe con ese DNI" };
      }
    }

    const updated = await ExplorersRepository.updateGuardian(targetId, {
      first_name: body.first_name,
      last_name: body.last_name,
      dni_type: body.dni_type,
      dni_type_other: body.dni_type_other,
      dni: body.dni,
      phone: body.phone,
      member_id: body.member_id === null || body.member_id === "" ? null : body.member_id
    });

    return { status: 200, message: "Acudiente actualizado", data: serializeBigInt(updated) };
  }

  static async removeGuardian(id: string) {
    const targetId = BigInt(id);
    const exists = await ExplorersRepository.findGuardianById(targetId);
    if (!exists) return { status: 404, message: "Acudiente no encontrado" };

    const activeExplorerCount = await ExplorersRepository.countActiveExplorersByGuardian(targetId);
    if (activeExplorerCount > 0) {
      return {
        status: 409,
        message: "No se puede eliminar el acudiente porque tiene exploradores activos"
      };
    }

    await ExplorersRepository.softDeleteGuardian(targetId);
    return { status: 200, message: "Acudiente eliminado" };
  }
}
