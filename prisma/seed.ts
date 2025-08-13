import { callTraccarAdminApi } from "@/config/callTraccarAdminApi";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "emmanuel@admin.com";
  const adminPassword = "emmanueladmin";

  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    try {
      // Step 1: Create the user in Traccar
      console.log("Creating admin user in Traccar...");
      const newTraccarUser = await callTraccarAdminApi("users", "POST", {
        name: "Super Admin",
        email: adminEmail,
        password: adminPassword,
        readonly: false,
        administrator: true,
      });

      // Step 2: Create the user in your PostgreSQL database
      console.log("Creating admin user in local database...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: "Super Admin",
          role: "admin",
          password: hashedPassword,
          traccarId: newTraccarUser.id.toString(),
        },
      });

      console.log(
        "Admin user created successfully in both the database and Traccar."
      );
    } catch (error) {
      console.error("Failed to create admin user:", error);
      throw error;
    }
  } else {
    console.log("Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
