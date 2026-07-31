import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadCatalogImage } from "./upload-catalog-image";

describe("upload catalog image", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads to the requested catalog folder and returns its public URL", async () => {
    vi.spyOn(Date, "now").mockReturnValue(123);
    const upload = vi.fn(async () => ({ error: null }));
    const getPublicUrl = vi.fn(() => ({
      data: { publicUrl: "https://assets.example/products/remera-123.jpg" },
    }));
    const from = vi.fn(() => ({ upload, getPublicUrl }));
    const supabase = { storage: { from } };
    const file = new File(["image"], "remera.jpeg", { type: "image/jpeg" });

    await expect(
      uploadCatalogImage({
        file,
        folder: "products",
        slug: "remera",
        supabase: supabase as never,
      }),
    ).resolves.toBe("https://assets.example/products/remera-123.jpg");
    expect(upload).toHaveBeenCalledWith(
      "products/remera-123.jpg",
      file,
      {
        cacheControl: "31536000",
        contentType: "image/jpeg",
        upsert: false,
      },
    );
    expect(from).toHaveBeenCalledWith("catalog-assets");
  });

  it("preserves the observable upload error", async () => {
    const upload = vi.fn(async () => ({
      error: { message: "storage unavailable" },
    }));
    const from = vi.fn(() => ({ upload }));
    const file = new File(["image"], "dino.png", { type: "image/png" });

    await expect(
      uploadCatalogImage({
        file,
        folder: "designs",
        slug: "dino",
        supabase: { storage: { from } } as never,
      }),
    ).rejects.toThrow("No pudimos subir la imagen: storage unavailable");
  });

  it("skips storage when no image was selected", async () => {
    const from = vi.fn();

    await expect(
      uploadCatalogImage({
        file: null,
        folder: "designs",
        slug: "dino",
        supabase: { storage: { from } } as never,
      }),
    ).resolves.toBeNull();
    expect(from).not.toHaveBeenCalled();
  });
});
