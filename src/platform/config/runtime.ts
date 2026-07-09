import { getOptionalEnv } from "./env";

export function isProductionRuntime() {
  return getOptionalEnv("VERCEL_ENV") === "production";
}
