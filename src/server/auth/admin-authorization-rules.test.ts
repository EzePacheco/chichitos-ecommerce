import { describe, expect, it } from "vitest";
import { decideAdminAuthorization, type AdminUserRecord } from "./admin-authorization-rules";

function createAdmin(overrides: Partial<AdminUserRecord> = {}): AdminUserRecord {
  return {
    id: "adm_test",
    user_id: "usr_test",
    email: "admin@chichitos.com",
    role: "admin",
    is_active: true,
    ...overrides,
  };
}

describe("admin authorization rules", () => {
  it("authorizes an active persisted admin", () => {
    const admin = createAdmin();

    expect(
      decideAdminAuthorization({
        email: "admin@chichitos.com",
        existingAdmin: admin,
        isBootstrapEmail: false,
      }),
    ).toEqual({ status: "authorized", source: "persisted", adminUser: admin });
  });

  it("denies inactive admins before checking bootstrap", () => {
    expect(
      decideAdminAuthorization({
        email: "admin@chichitos.com",
        existingAdmin: createAdmin({ is_active: false }),
        isBootstrapEmail: true,
      }),
    ).toEqual({ status: "denied", reason: "inactive_admin" });
  });

  it("requires bootstrap only for allowlisted emails without an existing admin", () => {
    expect(
      decideAdminAuthorization({
        email: " ADMIN@Chichitos.com ",
        existingAdmin: null,
        isBootstrapEmail: true,
      }),
    ).toEqual({ status: "bootstrap_required", email: "admin@chichitos.com" });
  });

  it("denies authenticated users that are not allowlisted", () => {
    expect(
      decideAdminAuthorization({
        email: "cliente@gmail.com",
        existingAdmin: null,
        isBootstrapEmail: false,
      }),
    ).toEqual({ status: "denied", reason: "not_allowlisted" });
  });

  it("denies users without email", () => {
    expect(
      decideAdminAuthorization({
        email: undefined,
        existingAdmin: null,
        isBootstrapEmail: true,
      }),
    ).toEqual({ status: "denied", reason: "missing_email" });
  });
});
