import type { LucideIcon } from "lucide-react";
import { ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function EmptyState({
  title,
  children,
  icon: Icon = ShoppingBag,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="empty__art">
        <Icon size={56} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  );
}
