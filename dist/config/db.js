import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "./env.js";
const globalForPrisma = globalThis;
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const adapter = new PrismaMariaDb({
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    connectionLimit: 5,
});
// const adapter = new PrismaMariaDb({
// });
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query", "error", "warn"],
        adapter,
    });
if (env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
