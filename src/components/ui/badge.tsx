import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-surface text-muted ring-1 ring-border",
      accent: "bg-accent/15 text-accent-soft",
      warn: "bg-warn/15 text-warn",
      danger: "bg-danger/15 text-danger",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
