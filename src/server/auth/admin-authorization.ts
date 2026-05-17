import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/server/supabase/admin";
import { isBootstrapAdminEmail, normalizeAdminEmail } from "./admin-bootstrap";
import {
  decideAdminAuthorization,
  type AdminUserRecord,
} from "./admin-authorization-rules";

export type {
  AdminAuthorizationDecision,
  AdminUserRecord,
} from "./admin-authorization-rules";

export type AdminAuthorizationResult =
  | { status: "unauthenticated" }
  | {
      status: "authorized";
      source: "persisted" | "bootstrap";
      user: User;
      email: string;
      adminUser: AdminUserRecord;
    }
  | {
      status: "denied";
      reason:
        | "missing_email"
        | "inactive_admin"
        | "not_allowlisted"
        | "admin_lookup_failed"
        | "bootstrap_failed";
      email?: string;
    };

export async function getAdminAuthorization(): Promise<AdminAuthorizationResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "unauthenticated" };
  }

  return resolveAuthenticatedAdmin(user);
}

async function resolveAuthenticatedAdmin(
  user: User,
): Promise<AdminAuthorizationResult> {
  const email = user.email ? normalizeAdminEmail(user.email) : undefined;
  const adminClient = createAdminSupabaseClient();

  const { data: existingAdmin, error: existingAdminError } = await adminClient
    .from("admin_users")
    .select("id,user_id,email,role,is_active")
    .eq("user_id", user.id)
    .maybeSingle<AdminUserRecord>();

  if (existingAdminError) {
    return { status: "denied", reason: "admin_lookup_failed", email };
  }

  const decision = decideAdminAuthorization({
    email,
    existingAdmin,
    isBootstrapEmail: email ? isBootstrapAdminEmail(email) : false,
  });

  if (decision.status === "authorized") {
    return {
      status: "authorized",
      source: decision.source,
      user,
      email: normalizeAdminEmail(decision.adminUser.email),
      adminUser: decision.adminUser,
    };
  }

  if (decision.status === "denied") {
    return { status: "denied", reason: decision.reason, email };
  }

  const { data: bootstrappedAdmin, error: bootstrapError } = await adminClient
    .from("admin_users")
    .insert({
      user_id: user.id,
      email: decision.email,
      role: "admin",
      is_active: true,
    })
    .select("id,user_id,email,role,is_active")
    .single<AdminUserRecord>();

  if (!bootstrapError && bootstrappedAdmin) {
    return {
      status: "authorized",
      source: "bootstrap",
      user,
      email: decision.email,
      adminUser: bootstrappedAdmin,
    };
  }

  const { data: adminAfterRace } = await adminClient
    .from("admin_users")
    .select("id,user_id,email,role,is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle<AdminUserRecord>();

  if (adminAfterRace) {
    return {
      status: "authorized",
      source: "persisted",
      user,
      email: normalizeAdminEmail(adminAfterRace.email),
      adminUser: adminAfterRace,
    };
  }

  return {
    status: "denied",
    reason: "bootstrap_failed",
    email: decision.email,
  };
}
