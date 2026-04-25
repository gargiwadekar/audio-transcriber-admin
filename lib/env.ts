import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().optional(),
});

let parsedEnv: z.infer<typeof serverSchema> | null = null;

export function getEnv() {
  if (parsedEnv) return parsedEnv;

  parsedEnv = serverSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
  });

  return parsedEnv;
}