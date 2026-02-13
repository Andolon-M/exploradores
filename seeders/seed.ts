import { prisma } from "../src/config/database/db";

const RESOURCES = ["explorers", "commanders"];
const ACTIONS = ["create", "read", "update", "delete"];

async function main() {
  const now = new Date();

  const adminRole = await prisma.roles.upsert({
    where: { name: "ADMIN" },
    update: { updated_at: now },
    create: { name: "ADMIN", created_at: now, updated_at: now }
  });

  for (const resource of RESOURCES) {
    for (const action of ACTIONS) {
      const permission = await prisma.permissions.upsert({
        where: {
          resource_action_type: {
            resource,
            action,
            type: 0
          }
        },
        update: { updated_at: now },
        create: {
          resource,
          action,
          type: 0,
          created_at: now,
          updated_at: now
        }
      });

      await prisma.role_has_permissions.upsert({
        where: {
          permission_id_role_id: {
            permission_id: permission.id,
            role_id: adminRole.id
          }
        },
        update: {},
        create: {
          permission_id: permission.id,
          role_id: adminRole.id
        }
      });
    }
  }

  console.log("Seed completado: rol ADMIN y permisos base creados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
