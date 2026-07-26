export type AdminActionState =
  | { status: "idle" }
  | { status: "invalid"; errors: string[] }
  | { status: "error"; message: string };

export const idleAdminActionState: AdminActionState = { status: "idle" };
