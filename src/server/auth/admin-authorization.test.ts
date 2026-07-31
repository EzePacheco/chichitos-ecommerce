import { describe, expect, it } from "vitest";
import { getDevelopmentAdminAuthorization } from "./admin-authorization";

describe("development admin authorization", () => {
  it("authorizes the local admin only when development bypass is explicit", () => {
    expect(
      getDevelopmentAdminAuthorization({
        nodeEnv: "development",
        enabled: "true",
      }),
    ).toMatchObject({
      status: "authorized",
      source: "development",
      email: "dev-admin@chichitos.local",
    });
  });

  it("stays disabled in production even when the flag is present", () => {
    expect(
      getDevelopmentAdminAuthorization({
        nodeEnv: "production",
        enabled: "true",
      }),
    ).toBeNull();
  });

  it("denies bypass when the local flag is absent", () => {
    expect(
      getDevelopmentAdminAuthorization({
        nodeEnv: "development",
        enabled: undefined,
      }),
    ).toBeNull();
  });
});
