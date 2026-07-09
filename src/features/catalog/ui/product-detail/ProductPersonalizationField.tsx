"use client";

import { formatMoney } from "@/shared/formatting/money";
import type { ProductPersonalization } from "../../model/catalog-products";

type ProductPersonalizationFieldProps = {
  personalName: string;
  personalization: ProductPersonalization;
  personalize: boolean;
  setPersonalName: (personalName: string) => void;
  setPersonalize: (personalize: boolean) => void;
};

export function ProductPersonalizationField({
  personalName,
  personalization,
  personalize,
  setPersonalName,
  setPersonalize,
}: ProductPersonalizationFieldProps) {
  if (!personalization.enabled) return null;

  return (
    <div className="option-group">
      <label
        style={{
          alignItems: "flex-start",
          background: "var(--cream-100)",
          border: "1px dashed var(--sand-400)",
          borderRadius: "var(--r-lg)",
          cursor: "pointer",
          display: "flex",
          gap: 12,
          padding: 16,
        }}
      >
        <input
          type="checkbox"
          checked={personalize}
          onChange={(event) => setPersonalize(event.target.checked)}
          style={{ marginTop: 4 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>
            {personalization.label}{" "}
            <span style={{ color: "var(--ink-500)", fontWeight: 400 }}>
              +{formatMoney(personalization.extraPriceCents)}
            </span>
          </div>
          <div
            style={{
              color: "var(--ink-500)",
              fontSize: "var(--fs-caption)",
            }}
          >
            {personalization.description}
          </div>
          {personalize ? (
            <input
              type="text"
              placeholder="Ej: Mateo"
              value={personalName}
              onChange={(event) => setPersonalName(event.target.value)}
              className="input"
              maxLength={16}
              style={{ marginTop: 10, maxWidth: 240 }}
            />
          ) : null}
        </div>
      </label>
    </div>
  );
}
