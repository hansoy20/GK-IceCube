require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@gkicecube.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: { name: "GK Admin", email: adminEmail, passwordHash, role: "ADMIN" },
    });
    console.log(`Created admin account: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin account already exists, skipping.");
  }

  await prisma.product.deleteMany({}); // Clear existing products
  const products = [
    {
      name: "Purified Ice Cubes",
      category: "Cube Ice",
      sizeLabel: "per kg",
      pricePerKg: 8.0,
      description: "Clean, slow-melting purified ice cubes. Ideal for Sari-Sari stores and parties.",
      stockKg: 1000.0,
    }
  ];

  for (const p of products) {
    const slug = slugify(p.name);
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (exists) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        category: p.category,
        sizeLabel: p.sizeLabel,
        pricePerKg: p.pricePerKg,
        inventory: { create: { stockKg: p.stockKg, lowStockThresholdKg: 50 } },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
