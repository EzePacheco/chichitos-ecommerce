import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";

type FeedbackTone = "info" | "success" | "warning" | "error";

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

export function AdminFeedback({
  tone = "info",
  title,
  children,
}: {
  tone?: FeedbackTone;
  title?: string;
  children: ReactNode;
}) {
  const Icon = icons[tone];

  return (
    <div
      className="admin-feedback"
      data-tone={tone}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon size={20} />
      <div>
        {title ? <strong>{title}</strong> : null}
        <div className="admin-feedback__body">{children}</div>
      </div>
    </div>
  );
}
