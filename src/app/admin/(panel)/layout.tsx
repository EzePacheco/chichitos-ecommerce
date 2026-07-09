import type { ReactNode } from "react";
import { AdminShell } from "@/screens/admin/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
