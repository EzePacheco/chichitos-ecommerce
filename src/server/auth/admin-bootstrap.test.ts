import { describe, expect, it } from "vitest";
import { getBootstrapAdminEmails, isBootstrapAdminEmail, normalizeAdminEmail } from "./admin-bootstrap";

describe("admin bootstrap helpers", () => {
  it("normalizes admin emails", () => {
    expect(normalizeAdminEmail("  Admin@Chichitos.COM ")).toBe("admin@chichitos.com");
  });

  it("parses and deduplicates bootstrap emails", () => {
    expect(getBootstrapAdminEmails(" admin@chichitos.com,ADMIN@chichitos.com, tienda@gmail.com ")).toEqual([
      "admin@chichitos.com",
      "tienda@gmail.com",
    ]);
  });

  it("checks bootstrap membership case-insensitively", () => {
    expect(isBootstrapAdminEmail("TIENDA@gmail.com", "admin@chichitos.com, tienda@gmail.com")).toBe(true);
    expect(isBootstrapAdminEmail("otra@gmail.com", "admin@chichitos.com, tienda@gmail.com")).toBe(false);
  });
});
