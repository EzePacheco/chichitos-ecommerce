import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Info } from "lucide-react";
import { Eyebrow } from "@/shared/ui/design-system";
import { getAdminAuthorization } from "@/server/auth/admin-authorization";
import { buildAdminLoginPath } from "@/server/auth/redirects";
import { AdminNav } from "@/features/admin/ui/AdminNav";

const deniedReasonLabels: Record<string, string> = {
  admin_lookup_failed:
    "No pudimos validar tu rol admin. Probá nuevamente o revisá la configuración server-side.",
  bootstrap_failed:
    "Tu email está en la allowlist, pero no pudimos crear el registro admin.",
  inactive_admin: "Tu usuario admin existe pero está desactivado.",
  missing_email: "La cuenta autenticada no tiene email verificable.",
  not_allowlisted:
    "Tu cuenta Google no está autorizada para administrar Chichitos.",
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
            <Eyebrow>Acceso restringido</Eyebrow>
            <h1 className="display-l mt-2">No tenés acceso al admin</h1>
            <p>{deniedReasonLabels[authorization.reason]}</p>
            {authorization.email ? (
              <span className="chip">Cuenta actual: {authorization.email}</span>
            ) : null}
            <div className="disclaimer">
              <Info size={20} />
              <div>
                El panel mantiene los controles globales: sesión Google válida,
                rol persistido en Supabase y bootstrap limitado por allowlist.
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const displayName = getAdminDisplayName(authorization.email);

  return (
    <div className="admin">
      <AdminNav email={authorization.email} displayName={displayName} />
      <main className="admin__main">{children}</main>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin__head">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}
