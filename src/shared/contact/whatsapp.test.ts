import { describe, expect, it } from "vitest";
import { buildWhatsAppHref, sanitizeWhatsAppPhoneNumber } from "./whatsapp";

describe("whatsapp helpers", () => {
  it("should sanitize phone numbers for wa.me links", () => {
    expect(sanitizeWhatsAppPhoneNumber("+54 9 11 3476-1068")).toBe("5491134761068");
  });

  it("should reject missing or unusable phone numbers", () => {
    expect(sanitizeWhatsAppPhoneNumber()).toBeUndefined();
    expect(sanitizeWhatsAppPhoneNumber("sin-numero")).toBeUndefined();
    expect(sanitizeWhatsAppPhoneNumber("123")).toBeUndefined();
  });

  it("should build a wa.me link with an encoded message", () => {
    expect(buildWhatsAppHref("+54 9 11 3476-1068", "Hola Chichitos")).toBe(
      "https://wa.me/5491134761068?text=Hola%20Chichitos",
    );
  });
});
