import { Prisma } from "@prisma/client";
import { prisma } from "@/config/database/db";

const groupSelect = {
  id: true,
  name: true,
  is_explorer: true,
  created_at: true,
  updated_at: true
} satisfies Prisma.groupsSelect;

type TxClient = Prisma.TransactionClient;

const withTx = <T>(executor: (tx: TxClient) => Promise<T>) => prisma.$transaction(executor);

export class GroupsRepository {
  static findAll() {
    return prisma.groups.findMany({
      where: { deleted_at: null },
      select: groupSelect,
      orderBy: { id: "desc" }
    });
  }

  static findById(id: bigint) {
    return prisma.groups.findFirst({
      where: { id, deleted_at: null },
      select: groupSelect
    });
  }

  static findByName(name: string) {
    return prisma.groups.findFirst({
      where: { name, deleted_at: null },
      select: { id: true }
    });
  }

  static create(payload: { name: string; is_explorer?: boolean }) {
    return withTx(async (tx) => {
      const now = new Date();
      return tx.groups.create({
        data: {
          name: payload.name,
          is_explorer: payload.is_explorer ?? false,
          created_at: now,
          updated_at: now
        },
        select: groupSelect
      });
    });
  }

  static update(
    id: bigint,
    payload: Partial<{
      name: string;
      is_explorer: boolean;
    }>
  ) {
    return withTx(async (tx) => {
      return tx.groups.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date()
        },
        select: groupSelect
      });
    });
  }

  static softDelete(id: bigint) {
    return withTx(async (tx) => {
      return tx.groups.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }
}
