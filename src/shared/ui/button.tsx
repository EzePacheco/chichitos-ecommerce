import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-ink-900 text-cream-50 shadow-sm hover:bg-ink-700 active:scale-[0.97]",
        primary:
          "bg-coral text-white shadow-sm hover:bg-coral-dark active:scale-[0.97]",
        soft:
          "bg-durazno text-ink-900 shadow-sm hover:bg-durazno-dark active:scale-[0.97]",
        ghost:
          "bg-transparent text-ink-900 border border-ink-900 hover:bg-ink-900 hover:text-cream-50",
        link: "text-celeste-dark underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
        whatsapp:
          "bg-whatsapp text-white shadow-sm hover:bg-whatsapp-dark active:scale-[0.97]",
        outline:
          "border border-input bg-background text-foreground hover:bg-cream-100",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-cream-300",
      },
      size: {
        default: "h-11 px-[22px] py-[14px] text-base",
        sm: "h-9 px-[14px] py-[9px] text-[0.9375rem]",
        lg: "h-12 px-7 py-4 text-[1.0625rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
