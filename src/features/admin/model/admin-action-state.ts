import type { ValidationIssue } from "@/shared/validation/validation-issue";

export type AdminActionState =
  | { status: "idle" }
  | {
      status: "invalid";
      fieldErrors: Record<string, string[]>;
      formErrors: string[];
    }
  | {
      status: "error";
      message: string;
      retryable: boolean;
      errorId?: string;
    };

export const idleAdminActionState: AdminActionState = { status: "idle" };

export function invalidAdminActionState(
  issues: ValidationIssue[] | string[],
): AdminActionState {
  const fieldErrors: Record<string, string[]> = {};
  const formErrors: string[] = [];

  for (const issue of issues) {
    if (typeof issue === "string") {
      formErrors.push(issue);
      continue;
    }

    if (!issue.field) {
      formErrors.push(issue.message);
      continue;
    }

    fieldErrors[issue.field] = [
      ...(fieldErrors[issue.field] ?? []),
      issue.message,
    ];
  }

  return { status: "invalid", fieldErrors, formErrors };
}
