import { describe, expect, it } from "vitest";
import {
  getAdminOrderPage,
  getAdminOrderOperationInput,
  getAdminOrderSummaries,
  parseAdminOrderOperationInput,
} from "./admin-orders";

describe("admin order operation parsing", () => {
  it("returns safe empty states when the catalog backend is not configured", async () => {
    await expect(getAdminOrderSummaries()).resolves.toEqual([]);
    await expect(getAdminOrderPage({ page: 2 })).resolves.toEqual({
      items: [],
      total: 0,
      page: 2,
      pageCount: 0,
    });
  });

  it("normalizes editable order operation fields", () => {
    const formData = new FormData();
    formData.set("orderId", "order-id");
    formData.set("operationalStatus", "ready");
    formData.set("buyerName", "Ezequiel");
    formData.set("buyerEmail", "");
    formData.set("buyerPhone", "+54 9 11 1234-5678");
    formData.set("adminNotes", "Listo para retirar");
    formData.set("recipientName", "Eze");
    formData.set("addressLine", "Calle 123");
    formData.set("city", "CABA");
    formData.set("province", "Buenos Aires");
    formData.set("postalCode", "1000");
    formData.set("instructions", "");

    const parsed = parseAdminOrderOperationInput(
      getAdminOrderOperationInput(formData),
    );

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.order).toEqual({
      operational_status: "ready",
      buyer_name: "Ezequiel",
      buyer_email: null,
      buyer_phone: "5491112345678",
      admin_notes: "Listo para retirar",
    });
    expect(parsed.delivery.instructions).toBeNull();
  });

  it("rejects invalid status and phone", () => {
    const formData = new FormData();
    formData.set("orderId", "order-id");
    formData.set("operationalStatus", "paid");
    formData.set("buyerName", "Ezequiel");
    formData.set("buyerPhone", "123");

    expect(
      parseAdminOrderOperationInput(getAdminOrderOperationInput(formData)),
    ).toEqual({
      ok: false,
      errors: [
        {
          field: "operationalStatus",
          message: "Elegí un estado válido.",
        },
        {
          field: "buyerPhone",
          message: "Ingresá un teléfono válido con código de área.",
        },
      ],
    });
  });
});
