import { prisma } from "@/config/database/db";

export class CommandersRepository {
  static findAll() {
    return prisma.commanders.findMany({
      where: { deleted_at: null },
      include: { explorers: { where: { deleted_at: null } } },
      orderBy: { id: "desc" }
    });
  }

  static findById(id: bigint) {
    return prisma.commanders.findFirst({
      where: { id, deleted_at: null },
      include: { explorers: { where: { deleted_at: null } } }
    });
  }

  static create(payload: {
    dni?: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }) {
    const now = new Date();
    return prisma.commanders.create({
      data: {
        ...payload,
        created_at: now,
        updated_at: now
      }
    });
  }

  static update(
    id: bigint,
    payload: Partial<{
      dni?: string;
      first_name: string;
      last_name?: string;
      email?: string;
      phone?: string;
    }>
  ) {
    return prisma.commanders.update({
      where: { id },
      data: {
        ...payload,
        updated_at: new Date()
      }
    });
  }

  static softDelete(id: bigint) {
    return prisma.commanders.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
