import dotenv from "dotenv";
import { throwDeprecation } from "process";
dotenv.config();

const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_JWT_SECRET",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jwtSecret: process.env.SUPABASE_JWT_SECRET!,
  },
  nodeEnv: process.env.NODE_ENV || "development",
} as const;