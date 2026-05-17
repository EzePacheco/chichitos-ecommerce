import { normalizeAdminEmail } from "./admin-bootstrap";

export type AdminUserRecord = {
  id: string;
  user_id: string;
  email: string;
  role: "admin";
  is_active: boolean;
};

export type AdminAuthorizationDecision =
  | { status: "authorized"; source: "persisted"; adminUser: AdminUserRecord }
  | { status: "bootstrap_required"; email: string }
  | { status: "denied"; reason: "missing_email" | "inactive_admin" | "not_allowlisted" };

export function decideAdminAuthorization(input: {
  email?: string | null;
  existingAdmin?: AdminUserRecord | null;
  isBootstrapEmail: boolean;
}): AdminAuthorizationDecision {
  const email = input.email ? normalizeAdminEmail(input.email) : undefined;

  if (!email) {
    return { status: "denied", reason: "missing_email" };
  }

  if (input.existingAdmin?.is_active) {
    return { status: "authorized", source: "persisted", adminUser: input.existingAdmin };
  }

  if (input.existingAdmin && !input.existingAdmin.is_active) {
    return { status: "denied", reason: "inactive_admin" };
  }

  if (input.isBootstrapEmail) {
    return { status: "bootstrap_required", email };
  }

  return { status: "denied", reason: "not_allowlisted" };
}
