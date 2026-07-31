import { beforeEach, describe, expect, it, vi } from "vitest";
import { CATALOG_IMAGE_MAX_BYTES } from "@/features/catalog/public";
import { uploadCatalogImage } from "../upload-catalog-image";
import {
  getAdminDesignFormInput,
  parseAdminDesignInput,
  upsertAdminDesign,
} from "./admin-designs";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../upload-catalog-image", () => ({
  uploadCatalogImage: vi.fn(async () => null),
}));

describe("admin design parsing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    expect(
      parseAdminDesignInput(getAdminDesignFormInput(formData)),
    ).toMatchObject({
      ok: false,
      errors: expect.arrayContaining([
        expect.objectContaining({ field: "name" }),
        expect.objectContaining({ field: "summary" }),
        expect.objectContaining({ field: "status" }),
      ]),
    });
  });

  it("preserves the catalog image size error", () => {
    const formData = new FormData();
    formData.set("name", "Dino");
    formData.set("summary", "Dinosaurio");
    formData.set("status", "active");
    formData.set("baseExtraPrice", "0");
    formData.set(
      "image",
      new File(
        [new Uint8Array(CATALOG_IMAGE_MAX_BYTES + 1)],
        "imagen.png",
        { type: "image/png" },
      ),
    );

    expect(
      parseAdminDesignInput(getAdminDesignFormInput(formData)),
    ).toMatchObject({
      ok: false,
      errors: expect.arrayContaining([
        {
          field: "image",
          message: "Elegí una imagen de hasta 5 MB.",
        },
      ]),
    });
  });

  it("uploads designs through the catalog image adapter", async () => {
    const formData = new FormData();
    formData.set("name", "Dino");
    formData.set("summary", "Dinosaurio");
    formData.set("status", "active");
    formData.set("baseExtraPrice", "0");
    const parsed = parseAdminDesignInput(getAdminDesignFormInput(formData));
    const single = vi.fn(async () => ({
      data: { id: "design-id" },
      error: null,
    }));
    const select = vi.fn(() => ({ single }));
    const upsert = vi.fn(() => ({ select }));
    const supabase = { from: vi.fn(() => ({ upsert })) };

    if (!parsed.ok) throw new Error("expected valid design");

    await expect(
      upsertAdminDesign(parsed, supabase as never),
    ).resolves.toBe("design-id");
    expect(uploadCatalogImage).toHaveBeenCalledWith({
      file: null,
      folder: "designs",
      slug: "dino",
      supabase,
    });
  });
});
