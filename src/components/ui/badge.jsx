import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary hover:text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary hover:text-white",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive hover:text-white",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-600 hover:text-white",
        outline: "text-foreground hover:bg-gray-600 hover:text-white",
        available: "border-transparent bg-green-100 text-green-800 hover:bg-green-600 hover:text-white",
        unavailable: "border-transparent bg-red-100 text-red-800 hover:bg-red-600 hover:text-white",
        sold: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white",
        used: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-600 hover:text-white",
        active: "border-transparent bg-green-100 text-green-800 hover:bg-green-600 hover:text-white",
        completed: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white",
        expired: "border-transparent bg-red-100 text-red-800 hover:bg-red-600 hover:text-white",
        expiring: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-600 hover:text-white",
        pending: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-600 hover:text-white",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-600 hover:text-white",
        submitted: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white",
        settled: "border-transparent bg-green-100 text-green-800 hover:bg-green-600 hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }