import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  SECRECT_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRE: z.string(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("3306"),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("myprisma"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  PAGE_LIMIT: z.string().default("20"),
  ADMIN_EMAIL:z.string().default(""),
  ADMIN_PASSWORD:z.string().default("")
});

export const env = envSchema.parse(process.env);