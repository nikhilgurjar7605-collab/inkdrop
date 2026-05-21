import * as React from "react"
import { cn } from "@/lib/utils"

interface GenrePillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const GenrePill = React.forwardRef<HTMLButtonElement, GenrePillProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-200",
          active
            ? "bg-accent-muted text-accent border border-accent/50"
            : "bg-background-elevated text-text-secondary border border-transparent hover:bg-background-hover hover:text-text-primary",
          className
        )}
        {...props}
      />
    )
  }
)
GenrePill.displayName = "GenrePill"
