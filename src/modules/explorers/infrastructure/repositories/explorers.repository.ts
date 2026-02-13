import { Gender } from "@prisma/client";
import { prisma } from "@/config/database/db";

export class ExplorersRepository {
  static findAll() {
    return prisma.explorers.findMany({
      where: { deleted_at: null },
      include: { commander: true },
      orderBy: { id: "desc" }
    });
  }

  static findById(id: bigint) {
    return prisma.explorers.findFirst({
      where: { id, deleted_at: null },
      include: { commander: true }
    });
  }

  static create(payload: {
    first_name: string;
    last_name?: string;
    dni?: string;
    birthdate?: Date;
    gender?: Gender;
    guardian_name?: string;
    guardian_phone?: string;
    commander_id?: bigint;
  }) {
    const now = new Date();
    return prisma.explorers.create({
      data: {
        ...payload,
        created_at: now,
        updated_at: now
      },
      include: { commander: true }
    });
  }

  static update(
    id: bigint,
    payload: Partial<{
      first_name: string;
      last_name?: string;
      dni?: string;
      birthdate?: Date;
      gender?: Gender;
      guardian_name?: string;
      guardian_phone?: string;
      commander_id?: bigint | null;
    }>
  ) {
    return prisma.explorers.update({
      where: { id },
      data: {
        ...payload,
        updated_at: new Date()
      },
      include: { commander: true }
    });
  }

  static softDelete(id: bigint) {
    return prisma.explorers.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
