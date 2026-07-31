import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import { buildAdminLoginPath } from "@/server/auth/redirects";
import { AdminNav } from "@/features/admin/ui/AdminNav";
import { AdminFeedback } from "@/features/admin/ui/AdminFeedback";

const deniedReasonLabels: Record<string, string> = {
  admin_lookup_failed:
    "No pudimos validar el acceso en este momento. Volvé a intentar.",
  bootstrap_failed:
    "No pudimos habilitar esta cuenta en este momento. Volvé a intentar.",
  inactive_admin: "El acceso de esta cuenta está desactivado.",
  missing_email: "La cuenta autenticada no tiene email verificable.",
  not_allowlisted:
    "Esta cuenta no tiene permiso para administrar Chichitos.",
};

export function getAdminDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "admin";
  const firstToken = localPart.split(/[._-]/)[0] || "admin";

  return `${firstToken.charAt(0).toUpperCase()}${firstToken.slice(1)}`;
}

export async function AdminShell({ children }: { children: ReactNode }) {
  const authorization = await getAdminAuthorization();

  if (authorization.status === "unauthenticated") {
    redirect(buildAdminLoginPath("/admin"));
  }

  if (authorization.status === "denied") {
    return (
      <section className="section">
        <div className="container">
          <div className="card admin__denied">
            <span className="eyebrow">Acceso restringido</span>
            <h1 className="display-l mt-2">Esta cuenta no tiene acceso</h1>
            <AdminFeedback tone="warning" title="Probá con la cuenta autorizada">
              {deniedReasonLabels[authorization.reason]}
            </AdminFeedback>
            {authorization.email ? (
              <span className="chip">Cuenta actual: {authorization.email}</span>
            ) : null}
            <p className="caption">
              Si el problema continúa, compartí la cuenta actual con la persona
              responsable de la tienda.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const displayName = getAdminDisplayName(authorization.email);

  return (
    <div className="admin">
      <AdminNav email={authorization.email} displayName={displayName} />
      <main className="admin__main">
        <div className="admin__content">{children}</div>
      </main>
    </div>
  );
}
