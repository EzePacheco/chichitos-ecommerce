import { describe, expect, it } from "vitest";
import {
  CATALOG_IMAGE_MAX_BYTES,
  CATALOG_IMAGE_MIME_TYPES,
  validateCatalogImage,
} from "./public";

describe("catalog image policy", () => {
  it.each(CATALOG_IMAGE_MIME_TYPES)("accepts %s", (type) => {
    expect(validateCatalogImage({ type, size: 1 })).toBeNull();
  });

  it.each(["image/svg+xml", "image/gif", "application/pdf"])(
    "rejects %s",
    (type) => {
      expect(validateCatalogImage({ type, size: 1 })).toBe(
        "Elegí una imagen PNG, JPG, WebP o AVIF.",
      );
    },
  );

  it("accepts the exact size limit", () => {
    expect(
      validateCatalogImage({
        type: "image/png",
        size: CATALOG_IMAGE_MAX_BYTES,
      }),
    ).toBeNull();
  });

  it("rejects a file above the size limit", () => {
    expect(
      validateCatalogImage({
        type: "image/png",
        size: CATALOG_IMAGE_MAX_BYTES + 1,
      }),
    ).toBe("Elegí una imagen de hasta 5 MB.");
  });
});
