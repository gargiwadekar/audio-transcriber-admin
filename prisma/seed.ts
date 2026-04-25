import { randomUUID } from "crypto";

import { PrismaClient } from "@prisma/client";
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } from "../lib/constants";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: ADMIN_EMAIL,
    },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const userId = randomUUID();
  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  const now = new Date();

  await prisma.user.create({
    data: {
      id: userId,
      name: "System Admin",
      email: ADMIN_EMAIL,
      emailVerified: true,
      role: "admin",
      username: ADMIN_USERNAME,
      displayUsername: ADMIN_USERNAME,
      createdAt: now,
      updatedAt: now,
      accounts: {
        create: {
          id: randomUUID(),
          accountId: userId,
          providerId: "credential",
          password: passwordHash,
          createdAt: now,
          updatedAt: now,
        },
      },
    },
  });

  console.log("Default admin user created.");
}

main()
  .catch((error) => {
    console.error("Admin seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
