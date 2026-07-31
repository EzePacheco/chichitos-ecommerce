"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AlertCircle, Check, Info } from "lucide-react";
import { validateCatalogImage } from "@/features/catalog/public";
import { Button } from "@/shared/ui/button";
import {
  idleAdminActionState,
  type AdminActionState,
} from "../model/admin-action-state";

type AdminFormFeedback = {
  fieldErrors: Record<string, string[]>;
  getFieldErrors: (name: string) => string[];
};

const AdminFormFeedbackContext = createContext<AdminFormFeedback>({
  fieldErrors: {},
  getFieldErrors: () => [],
});

export function useAdminFormFeedback() {
  return useContext(AdminFormFeedbackContext);
}

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
  const [clientFieldErrors, setClientFieldErrors] = useState<
    Record<string, string[]>
  >({});
  const alertsRef = useRef<HTMLDivElement>(null);
  const formErrors = state.status === "invalid" ? state.formErrors : [];
  const fieldErrors = useMemo(
    () => ({
      ...(state.status === "invalid" ? state.fieldErrors : {}),
      ...clientFieldErrors,
    }),
    [clientFieldErrors, state],
  );
  const feedback = useMemo<AdminFormFeedback>(
    () => ({
      fieldErrors,
      getFieldErrors: (name) => fieldErrors[name] ?? [],
    }),
    [fieldErrors],
  );
  const hasAlerts =
    state.status === "invalid" ||
    state.status === "error" ||
    Object.keys(clientFieldErrors).length > 0;

  useEffect(() => {
    if (hasAlerts) {
      alertsRef.current?.focus();
    }
  }, [hasAlerts, state, clientFieldErrors]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fileErrors: Record<string, string[]> = {};

    for (const [name, value] of formData.entries()) {
      if (!(value instanceof File) || value.size === 0) continue;

      const imageError = validateCatalogImage(value);
      if (imageError) fileErrors[name] = [imageError];
    }

    setClientFieldErrors(fileErrors);
    if (Object.keys(fileErrors).length > 0) return;

    startTransition(() => dispatch(formData));
  }

  return (
    <form
      className={className}
      encType="multipart/form-data"
      noValidate
      onSubmit={handleSubmit}
    >
      <AdminFormFeedbackContext.Provider value={feedback}>
        {children}

        {state.status === "invalid" ||
        Object.keys(clientFieldErrors).length > 0 ? (
          <div
            className="admin-feedback"
            data-tone="error"
            ref={alertsRef}
            role="alert"
            tabIndex={-1}
          >
            <AlertCircle size={20} />
            <div>
              <strong>Revisá los datos antes de guardar</strong>
              <ul className="admin-form__errors">
                {formErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
                {Object.entries(fieldErrors).flatMap(([field, errors]) =>
                  errors.map((error) => (
                    <li key={`${field}-${error}`}>
                      <a href={`#${field}`}>{error}</a>
                    </li>
                  )),
                )}
              </ul>
            </div>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div
            className="admin-feedback"
            data-tone="error"
            ref={alertsRef}
            role="alert"
            tabIndex={-1}
          >
            <Info size={20} />
            <div>
              <strong>No pudimos guardar los cambios</strong>
              <p>{state.message}</p>
              {state.retryable ? (
                <span>Revisá tu conexión y volvé a intentar.</span>
              ) : null}
              {state.errorId ? (
                <span className="admin-feedback__code">
                  Código de soporte: {state.errorId}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="admin-form__submit-bar">
          <span className="admin-form__submit-hint">
            Revisá los datos antes de confirmar.
          </span>
          <Button type="submit" variant="primary" disabled={isPending}>
            <Check size={20} /> {isPending ? pendingLabel : submitLabel}
          </Button>
        </div>
      </AdminFormFeedbackContext.Provider>
    </form>
  );
}
