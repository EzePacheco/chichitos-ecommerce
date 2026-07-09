import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/ui/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-[0.8125rem] font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-cream-50 text-ink-700",
        dashed: "border-dashed border-sand-400 bg-cream-50 text-ink-700",
        durazno: "border-transparent bg-durazno text-ink-900",
        salvia: "border-transparent bg-salvia text-ink-900",
        celeste: "border-transparent bg-celeste text-ink-900",
        mostaza: "border-transparent bg-mostaza text-ink-900",
        coral: "border-transparent bg-coral text-white",
        ink: "border-ink-900 bg-ink-900 text-cream-50",
        outline: "border-border bg-transparent text-ink-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
