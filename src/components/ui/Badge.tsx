import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error" | "crimson"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-surface-elevated text-text-primary": variant === "default",
          "bg-border text-text-secondary": variant === "secondary",
          "text-text-primary border border-border": variant === "outline",
          "bg-success/20 text-success": variant === "success",
          "bg-warning/20 text-warning": variant === "warning",
          "bg-error/20 text-error": variant === "error",
          "bg-crimson/20 text-crimson-hover": variant === "crimson",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
