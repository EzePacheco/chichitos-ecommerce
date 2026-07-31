"use client";

import {
  cloneElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { useAdminFormFeedback } from "./AdminActionForm";

type AdminFieldControlProps = {
  id?: string;
  name?: string;
  required?: boolean;
  "aria-required"?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type AdminFieldProps = {
  name: string;
  label: string;
  requirement: "required" | "optional";
  hint?: ReactNode;
  children: ReactElement<AdminFieldControlProps>;
  className?: string;
};

export function AdminField({
  name,
  label,
  requirement,
  hint,
  children,
  className = "field",
}: AdminFieldProps) {
  const { getFieldErrors } = useAdminFormFeedback();
  const errors = getFieldErrors(name);
  const controlId = children.props.id ?? name;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = errors.length > 0 ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className} data-invalid={errors.length > 0 || undefined}>
      <label htmlFor={controlId}>
        {label}
        <span className="admin-field__requirement">
          {requirement === "required" ? "Obligatorio" : "Opcional"}
        </span>
      </label>
      {hint ? (
        <div className="admin-field__hint" id={hintId}>
          {hint}
        </div>
      ) : null}
      {cloneElement(children, {
        id: controlId,
        name: children.props.name ?? name,
        required: requirement === "required",
        "aria-required": requirement === "required",
        "aria-invalid": errors.length > 0,
        "aria-describedby": describedBy,
      })}
      {errors.length > 0 ? (
        <div className="admin-field__error" id={errorId}>
          {errors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
