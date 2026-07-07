const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the app (and across
// hot-reloads in dev) to avoid exhausting Postgres connections.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
