import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow } from "@/shared/ui/design-system";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  backHref,
  backLabel = "Volver",
}: AdminPageHeaderProps) {
  return (
    <header className="admin__head">
      <div className="admin__head-copy">
        {backHref ? (
          <Link className="admin__back" href={backHref}>
            <ArrowLeft size={16} /> {backLabel}
          </Link>
        ) : null}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? <div className="admin__head-action">{action}</div> : null}
    </header>
  );
}
