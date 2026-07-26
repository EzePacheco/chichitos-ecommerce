"use client";

import {
  startTransition,
  useActionState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  idleAdminActionState,
  type AdminActionState,
} from "../model/admin-action-state";

type AdminActionFormProps = {
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  submitLabel: string;
  pendingLabel: string;
  children: ReactNode;
  className?: string;
};

export function AdminActionForm({
  action,
  submitLabel,
  pendingLabel,
  children,
  className = "card admin-form",
}: AdminActionFormProps) {
  const [state, dispatch, isPending] = useActionState(
    action,
    idleAdminActionState,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  return (
    <form
      className={className}
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      {children}

      {state.status === "invalid" ? (
        <div className="disclaimer" role="alert">
          <Info size={20} />
          <div>
            <strong>Revisá estos campos antes de guardar:</strong>
            <ul className="admin-form__errors">
              {state.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {state.status === "error" ? (
        <div className="disclaimer" role="alert">
          <Info size={20} />
          <div>{state.message}</div>
        </div>
      ) : null}

      <Button type="submit" variant="primary" disabled={isPending}>
        <Check size={20} /> {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
