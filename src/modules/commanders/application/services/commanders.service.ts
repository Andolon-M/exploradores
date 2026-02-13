import { CommandersRepository } from "@/modules/commanders/infrastructure/repositories/commanders.repository";
import { serializeBigInt } from "@/shared/infrastructure/utils/serializeBigInt";
import { IdType, RecordStatus } from "@prisma/client";

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

  static async create(body: {
    dni: string;
    dni_type: IdType;
    dni_type_other?: string;
    first_name: string;
    last_name: string;
    cell: string;
    phone: string;
    member_id?: string;
    status?: RecordStatus;
  }) {
    const dniInUse = await CommandersRepository.findByDni(body.dni);
    if (dniInUse) return { status: 409, message: "El comandante ya existe con ese DNI" };

    const created = await CommandersRepository.create({
      dni: body.dni,
      dni_type: body.dni_type,
      dni_type_other: body.dni_type_other,
      first_name: body.first_name,
      last_name: body.last_name,
      cell: body.cell,
      phone: body.phone,
      member_id: body.member_id,
      status: body.status
    });
    return { status: 201, message: "Comandante creado", data: serializeBigInt(created) };
  }

  static async update(
    id: string,
    body: {
      dni?: string;
      dni_type?: IdType;
      dni_type_other?: string;
      first_name?: string;
      last_name?: string;
      cell?: string;
      phone?: string;
      member_id?: string | null;
      status?: RecordStatus;
    }
  ) {
    const targetId = BigInt(id);
    const exists = await CommandersRepository.findById(targetId);
    if (!exists) return { status: 404, message: "Comandante no encontrado" };

    if (body.dni && body.dni !== exists.dni) {
      const dniInUse = await CommandersRepository.findByDni(body.dni);
      if (dniInUse && dniInUse.id !== targetId) {
        return { status: 409, message: "El comandante ya existe con ese DNI" };
      }
    }

    const updated = await CommandersRepository.update(targetId, body);

    return { status: 200, message: "Comandante actualizado", data: serializeBigInt(updated) };
  }

  static async remove(id: string) {
    const exists = await CommandersRepository.findById(BigInt(id));
    if (!exists) return { status: 404, message: "Comandante no encontrado" };
    await CommandersRepository.softDelete(BigInt(id));
    return { status: 200, message: "Comandante eliminado" };
  }
}
