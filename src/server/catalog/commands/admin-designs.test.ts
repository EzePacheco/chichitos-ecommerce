import { describe, expect, it, vi } from "vitest";
import {
  getAdminDesignFormInput,
  parseAdminDesignInput,
} from "./admin-designs";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("admin design parsing", () => {
  it("normalizes a valid design form", () => {
    const formData = new FormData();
    formData.set("name", "Dino bebé");
    formData.set("summary", "Dinosaurio para bodies");
    formData.set("description", "Estampa DTF propia.");
    formData.set("status", "active");
    formData.set("baseExtraPrice", "1.200");

    const parsed = parseAdminDesignInput(getAdminDesignFormInput(formData));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.design).toMatchObject({
      slug: "dino-bebe",
      status: "active",
      baseExtraPriceCents: 120000,
    });
  });

  it("rejects invalid required fields", () => {
    const formData = new FormData();
    formData.set("status", "published");

    expect(parseAdminDesignInput(getAdminDesignFormInput(formData))).toMatchObject({
      ok: false,
    });
  });
});
