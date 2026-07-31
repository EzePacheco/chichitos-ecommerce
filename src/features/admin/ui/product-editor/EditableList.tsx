import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

type EditableListProps = {
  id: string;
  title: string;
  description: string;
  addLabel: string;
  children: ReactNode;
  onAdd: () => void;
  extraAction?: ReactNode;
};

export function EditableList({
  id,
  title,
  description,
  addLabel,
  children,
  onAdd,
  extraAction,
}: EditableListProps) {
  return (
    <section className="admin-form__section admin-editor__subsection" id={id}>
      <div className="admin-form__section-head">
        <div>
          <h3>{title}</h3>
          <p className="admin-form__hint">{description}</p>
        </div>
        <div className="admin-form__section-actions">
          {extraAction}
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus size={16} /> {addLabel}
          </Button>
        </div>
      </div>
      <div className="admin-form__list">{children}</div>
    </section>
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
