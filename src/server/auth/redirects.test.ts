import { describe, expect, it } from "vitest";
import { buildAdminLoginPath, sanitizeInternalRedirectPath } from "./redirects";

describe("auth redirect helpers", () => {
  it("accepts internal paths with query and hash", () => {
    expect(sanitizeInternalRedirectPath("/admin?tab=orders#top")).toBe("/admin?tab=orders#top");
  });

  it("falls back for external or protocol-relative redirects", () => {
    expect(sanitizeInternalRedirectPath("https://evil.test/admin")).toBe("/admin");
    expect(sanitizeInternalRedirectPath("//evil.test/admin")).toBe("/admin");
  });

  it("falls back for missing or unsafe paths", () => {
    expect(sanitizeInternalRedirectPath(undefined, "/catalogo")).toBe("/catalogo");
    expect(sanitizeInternalRedirectPath("admin", "/catalogo")).toBe("/catalogo");
    expect(sanitizeInternalRedirectPath("/admin\\evil", "/catalogo")).toBe("/catalogo");
  });

  it("builds the admin login path with an encoded safe next path", () => {
    expect(buildAdminLoginPath("/admin?tab=orders")).toBe("/admin/login?next=%2Fadmin%3Ftab%3Dorders");
  });
});
