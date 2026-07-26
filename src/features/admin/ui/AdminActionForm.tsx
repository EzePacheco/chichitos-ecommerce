"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Check, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  idleAdminActionState,
  type AdminActionState,
} from "../model/admin-action-state";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

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
  const [fileError, setFileError] = useState<string | null>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const hasAlerts =
    state.status === "invalid" || state.status === "error" || Boolean(fileError);

  useEffect(() => {
    if (hasAlerts) {
      alertsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [hasAlerts, state, fileError]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    for (const value of formData.values()) {
      if (value instanceof File && value.size > MAX_UPLOAD_BYTES) {
        setFileError(
          "La imagen supera los 5 MB. Elegí una foto más liviana y volvé a intentar.",
        );
        return;
      }
    }

    setFileError(null);
    startTransition(() => dispatch(formData));
  }

  return (
    <form
      className={className}
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      {children}

      <div ref={alertsRef}>
        {fileError ? (
          <div className="disclaimer" role="alert">
            <Info size={20} />
            <div>{fileError}</div>
          </div>
        ) : null}

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
      </div>

      <Button type="submit" variant="primary" disabled={isPending}>
        <Check size={20} /> {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
