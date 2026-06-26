import { afterEach, describe, expect, it, vi } from "vitest";
import { hasRealSupabaseConfig } from "./readiness";

describe("readiness config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects example Supabase env values", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "replace-with-key");
    vi.stubEnv("SUPABASE_SECRET_KEY", "replace-with-secret-key");

    expect(hasRealSupabaseConfig()).toBe(false);
  });

  it("accepts real-looking Supabase env values", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "pub-key");
    vi.stubEnv("SUPABASE_SECRET_KEY", "secret-key");

    expect(hasRealSupabaseConfig()).toBe(true);
  });
});
