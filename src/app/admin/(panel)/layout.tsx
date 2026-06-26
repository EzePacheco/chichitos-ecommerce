import type { ReactNode } from "react";
import { AdminShell } from "@/features/admin/components/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
