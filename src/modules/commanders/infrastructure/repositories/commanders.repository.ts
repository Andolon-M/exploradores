import { IdType, Prisma, RecordStatus } from "@prisma/client";
import { prisma } from "@/config/database/db";

type TxClient = Prisma.TransactionClient;

const withTx = <T>(executor: (tx: TxClient) => Promise<T>) => prisma.$transaction(executor);

const commanderSelect = {
  id: true,
  dni: true,
  dni_type: true,
  dni_type_other: true,
  first_name: true,
  last_name: true,
  cell: true,
  phone: true,
  member_id: true,
  status: true,
  created_at: true,
  updated_at: true
} satisfies Prisma.commandersSelect;

export class CommandersRepository {
  static findAll() {
    return prisma.commanders.findMany({
      where: { deleted_at: null },
      select: commanderSelect,
      orderBy: { id: "desc" }
    });
  }

  static findById(id: bigint) {
    return prisma.commanders.findFirst({
      where: { id, deleted_at: null },
      select: commanderSelect
    });
  }

  static findByDni(dni: string) {
    return prisma.commanders.findFirst({
      where: { dni, deleted_at: null },
      select: { id: true }
    });
  }

  static create(payload: {
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
    return withTx(async (tx) => {
      const now = new Date();
      return tx.commanders.create({
        data: {
          ...payload,
          created_at: now,
          updated_at: now
        },
        select: commanderSelect
      });
    });
  }

  static update(
    id: bigint,
    payload: Partial<{
      dni: string;
      dni_type: IdType;
      dni_type_other?: string;
      first_name: string;
      last_name: string;
      cell: string;
      phone: string;
      member_id?: string | null;
      status: RecordStatus;
    }>
  ) {
    return withTx(async (tx) => {
      return tx.commanders.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date()
        },
        select: commanderSelect
      });
    });
  }

  static softDelete(id: bigint) {
    return withTx(async (tx) => {
      return tx.commanders.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }
}
