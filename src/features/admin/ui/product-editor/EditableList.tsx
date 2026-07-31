"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAdminFormFeedback } from "../AdminActionForm";

type EditableListProps = {
  id: string;
  title: string;
  description: string;
  addLabel: string;
  children: ReactNode;
  onAdd: () => void;
  extraAction?: ReactNode;
  itemCount: number;
  defaultOpen?: boolean;
};

export function EditableList({
  id,
  title,
  description,
  addLabel,
  children,
  onAdd,
  extraAction,
  itemCount,
  defaultOpen = false,
}: EditableListProps) {
  const { getFieldErrors } = useAdminFormFeedback();
  const hasErrors = getFieldErrors(id).length > 0;
  const [open, setOpen] = useState(defaultOpen);
  const expanded = open || hasErrors;

  useEffect(() => {
    function openHashTarget() {
      if (window.location.hash === `#${id}`) setOpen(true);
    }

    window.addEventListener("hashchange", openHashTarget);
    return () => window.removeEventListener("hashchange", openHashTarget);
  }, [id]);

  return (
    <details
      className="admin-editor__details"
      id={id}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      open={expanded}
    >
      <summary className="admin-editor__details-summary">
        <div>
          <h3>{title}</h3>
          <span className="admin-editor__details-count">
            {itemCount} {itemCount === 1 ? "elemento" : "elementos"}
          </span>
        </div>
        <span>{expanded ? "Ocultar" : "Editar"}</span>
      </summary>
      <div className="admin-editor__details-body">
        <p className="admin-form__hint">{description}</p>
        <div className="admin-form__section-actions">
          {extraAction}
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus size={16} /> {addLabel}
          </Button>
        </div>
        <div className="admin-form__list">{children}</div>
      </div>
    </details>
  );
}

export function IconRemove({ onClick }: { onClick: () => void }) {
  return (
    <Button
      aria-label="Quitar fila"
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
    >
      <Trash2 size={16} />
    </Button>
  );
}
