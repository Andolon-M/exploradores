import { prisma } from "@/config/database/db";

export class AuthRepository {
  static findUserByEmail(email: string) {
    return prisma.users.findFirst({
      where: {
        email,
        deleted_at: null
      },
      include: {
        role: true
      }
    });
  }

  static async getOrCreateAdminRole() {
    const now = new Date();
    return prisma.roles.upsert({
      where: { name: "ADMIN" },
      update: { updated_at: now },
      create: { name: "ADMIN", created_at: now, updated_at: now }
    });
  }

  static createUser(payload: { email: string; password: string; role_id: bigint }) {
    const now = new Date();
    return prisma.users.create({
      data: {
        email: payload.email,
        password: payload.password,
        role_id: payload.role_id,
        created_at: now,
        updated_at: now
      },
      include: { role: true }
    });
  }

  static getUserWithPermissions(userId: bigint) {
    return prisma.users.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            role_has_permissions: {
              include: { permissions: true }
            }
          }
        }
      }
    });
  }
}
