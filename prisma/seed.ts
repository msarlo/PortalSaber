import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se admin já existe
    const adminExists = await prisma.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    });

    if (!adminExists) {
      const hashedPassword = await hash("admin123", 10);

      await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@example.com",
          senha: hashedPassword,
          role: Role.ADMIN,
        },
      });

      console.log("Admin user created successfully");
    }

    // Criando usuários de teste para SUS e SAUDE
    const testUsers = [
      {
        name: "Test SUS User",
        email: "sus@example.com",
        senha: await hash("test123", 10),
        role: Role.SUS,
      },
      {
        name: "Test SAUDE User",
        email: "saude@example.com",
        senha: await hash("test123", 10),
        role: Role.SAUDE,
      },
    ];

    for (const user of testUsers) {
      const exists = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!exists) {
        await prisma.user.create({ data: user });
        console.log(`Created user: ${user.name}`);
      }
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
