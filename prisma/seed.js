import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("adminpassword", 10);

  await prisma.user.create({
    data: {
      email: "admin@littlealley.sch.id",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("User data has been seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
