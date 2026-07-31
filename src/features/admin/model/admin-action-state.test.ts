import { describe, expect, it } from "vitest";
import { invalidAdminActionState } from "./admin-action-state";

describe("admin action validation state", () => {
  it("groups field errors and preserves general form errors", () => {
    expect(
      invalidAdminActionState([
        { field: "name", message: "Ingresá un nombre." },
        { field: "name", message: "Usá un nombre más corto." },
        { message: "Revisá los datos del formulario." },
      ]),
    ).toEqual({
      status: "invalid",
      fieldErrors: {
        name: ["Ingresá un nombre.", "Usá un nombre más corto."],
      },
      formErrors: ["Revisá los datos del formulario."],
    });
  });

  it("keeps legacy string errors at form level", () => {
    expect(invalidAdminActionState(["No pudimos validar el formulario."])).toEqual({
      status: "invalid",
      fieldErrors: {},
      formErrors: ["No pudimos validar el formulario."],
    });
  });
});
