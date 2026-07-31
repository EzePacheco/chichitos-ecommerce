import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/shared/ui/button";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  action?: { href: string; label: string };
};

export function AdminEmptyState({
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="admin-empty">
      <div className="admin-empty__icon">
        <SearchX size={28} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action ? (
        <Button asChild variant="primary">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
