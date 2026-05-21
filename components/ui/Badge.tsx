import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "muted"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-background-elevated text-text-primary border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-accent/10 text-accent border-accent/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    muted: "bg-background-elevated text-text-muted border-border",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
