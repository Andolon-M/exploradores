import { Gender, IdType, Prisma } from "@prisma/client";
import { prisma } from "@/config/database/db";

const explorerSelect = {
  id: true,
  explorer_guardian_id: true,
  dni_type: true,
  dni_type_other: true,
  dni: true,
  member_id: true,
  phone: true,
  first_name: true,
  last_name: true,
  birthdate: true,
  gender: true,
  created_at: true,
  updated_at: true,
  explorer_guardian: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      dni_type: true,
      dni_type_other: true,
      dni: true,
      phone: true,
      member_id: true
    }
  }
} satisfies Prisma.explorersSelect;

const guardianSelect = {
  id: true,
  first_name: true,
  last_name: true,
  dni_type: true,
  dni_type_other: true,
  dni: true,
  phone: true,
  member_id: true,
  created_at: true,
  updated_at: true
} satisfies Prisma.explorer_guardiansSelect;

export class ExplorersRepository {
  static findAll() {
    return prisma.explorers.findMany({
      where: { deleted_at: null },
      select: explorerSelect,
      orderBy: { id: "desc" }
    });
  }

  static findById(id: bigint) {
    return prisma.explorers.findFirst({
      where: { id, deleted_at: null },
      select: explorerSelect
    });
  }

  static findByDni(dni: string) {
    return prisma.explorers.findFirst({
      where: { dni, deleted_at: null },
      select: { id: true }
    });
  }

  static createWithGuardian(payload: {
    explorer: {
      dni_type: IdType;
      dni_type_other?: string;
      dni: string;
      member_id?: string;
      phone?: string;
      first_name?: string;
      last_name?: string;
      birthdate?: Date;
      gender?: Gender;
    };
    guardian: {
      first_name: string;
      last_name: string;
      dni_type: IdType;
      dni_type_other?: string;
      dni: string;
      phone: string;
      member_id?: string;
    };
  }) {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      const existingGuardian = await tx.explorer_guardians.findFirst({
        where: { dni: payload.guardian.dni, deleted_at: null },
        select: { id: true }
      });

      const guardian =
        existingGuardian ??
        (await tx.explorer_guardians.create({
          data: {
            ...payload.guardian,
            created_at: now,
            updated_at: now
          },
          select: { id: true }
        }));

      return tx.explorers.create({
        data: {
          ...payload.explorer,
          explorer_guardian_id: guardian.id,
          created_at: now,
          updated_at: now
        },
        select: explorerSelect
      });
    });
  }

  static updateWithOptionalGuardian(
    id: bigint,
    payload: {
      explorer: Partial<{
        dni_type: IdType;
        dni_type_other?: string;
        dni: string;
        member_id?: string | null;
        phone?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        birthdate?: Date | null;
        gender?: Gender | null;
      }>;
      guardian?: Partial<{
        first_name: string;
        last_name: string;
        dni_type: IdType;
        dni_type_other?: string;
        dni: string;
        phone: string;
        member_id?: string | null;
      }>;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.explorers.findFirst({
        where: { id, deleted_at: null },
        select: { id: true, explorer_guardian_id: true }
      });
      if (!existing) return null;

      if (payload.guardian) {
        await tx.explorer_guardians.update({
          where: { id: existing.explorer_guardian_id },
          data: {
            ...payload.guardian,
            updated_at: new Date()
          }
        });
      }

      return tx.explorers.update({
        where: { id: existing.id },
        data: {
          ...payload.explorer,
          updated_at: new Date()
        },
        select: explorerSelect
      });
    });
  }

  static softDelete(id: bigint) {
    return prisma.$transaction(async (tx) => {
      return tx.explorers.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }

  static findAllGuardians() {
    return prisma.explorer_guardians.findMany({
      where: { deleted_at: null },
      select: {
        ...guardianSelect,
        explorers: {
          where: { deleted_at: null },
          select: { id: true, first_name: true, last_name: true }
        }
      },
      orderBy: { id: "desc" }
    });
  }

  static findGuardianById(id: bigint) {
    return prisma.explorer_guardians.findFirst({
      where: { id, deleted_at: null },
      select: {
        ...guardianSelect,
        explorers: {
          where: { deleted_at: null },
          select: { id: true, first_name: true, last_name: true }
        }
      }
    });
  }

  static findGuardianByDni(dni: string) {
    return prisma.explorer_guardians.findFirst({
      where: { dni, deleted_at: null },
      select: { id: true }
    });
  }

  static createGuardian(payload: {
    first_name: string;
    last_name: string;
    dni_type: IdType;
    dni_type_other?: string;
    dni: string;
    phone: string;
    member_id?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      return tx.explorer_guardians.create({
        data: {
          ...payload,
          created_at: now,
          updated_at: now
        },
        select: guardianSelect
      });
    });
  }

  static updateGuardian(
    id: bigint,
    payload: Partial<{
      first_name: string;
      last_name: string;
      dni_type: IdType;
      dni_type_other?: string;
      dni: string;
      phone: string;
      member_id?: string | null;
    }>
  ) {
    return prisma.$transaction(async (tx) => {
      return tx.explorer_guardians.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date()
        },
        select: guardianSelect
      });
    });
  }

  static countActiveExplorersByGuardian(guardianId: bigint) {
    return prisma.explorers.count({
      where: { explorer_guardian_id: guardianId, deleted_at: null }
    });
  }

  static softDeleteGuardian(id: bigint) {
    return prisma.$transaction(async (tx) => {
      return tx.explorer_guardians.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }
}
