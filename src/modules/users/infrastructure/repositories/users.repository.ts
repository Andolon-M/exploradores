import { Prisma } from "@prisma/client";
import { prisma } from "@/config/database/db";

const userSelect = {
  id: true,
  email: true,
  role_id: true,
  created_at: true,
  updated_at: true,
  role: {
    select: {
      id: true,
      name: true
    }
  }
} satisfies Prisma.usersSelect;

type TxClient = Prisma.TransactionClient;

const withTx = <T>(executor: (tx: TxClient) => Promise<T>) => prisma.$transaction(executor);

export class UsersRepository {
  static findAll() {
    return prisma.users.findMany({
      where: { deleted_at: null },
      select: userSelect,
      orderBy: { id: "desc" }
    });
  }

  static findById(id: bigint) {
    return prisma.users.findFirst({
      where: { id, deleted_at: null },
      select: userSelect
    });
  }

  static findByEmail(email: string) {
    return prisma.users.findFirst({
      where: { email, deleted_at: null },
      select: { id: true }
    });
  }

  static roleExists(roleId: bigint) {
    return prisma.roles.findFirst({
      where: { id: roleId, deleted_at: null },
      select: { id: true }
    });
  }

  static create(payload: { email: string; password: string; role_id?: bigint }) {
    return withTx(async (tx) => {
      const now = new Date();
      return tx.users.create({
        data: {
          email: payload.email,
          password: payload.password,
          role_id: payload.role_id,
          created_at: now,
          updated_at: now
        },
        select: userSelect
      });
    });
  }

  static update(
    id: bigint,
    payload: Partial<{
      email: string;
      password: string;
      role_id: bigint | null;
    }>
  ) {
    return withTx(async (tx) => {
      return tx.users.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date()
        },
        select: userSelect
      });
    });
  }

  static softDelete(id: bigint) {
    return withTx(async (tx) => {
      return tx.users.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }
}
