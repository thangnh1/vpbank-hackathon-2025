import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "donation" | "campaign" | "milestone" | "audit"
  className?: string
}

const statusColors = {
  donation: {
    PENDING_PAYMENT: "bg-yellow-500/20 text-yellow-300",
    ONCHAIN_CONFIRMED: "bg-blue-500/20 text-blue-300",
    ESCROWED: "bg-purple-500/20 text-purple-300",
    COMPLETED: "bg-green-500/20 text-green-300",
    REFUNDED: "bg-red-500/20 text-red-300",
  },
  campaign: {
    DRAFT: "bg-gray-500/20 text-gray-300",
    LIVE: "bg-green-500/20 text-green-300",
    PAUSED: "bg-yellow-500/20 text-yellow-300",
    COMPLETED: "bg-blue-500/20 text-blue-300",
    REJECTED: "bg-red-500/20 text-red-300",
  },
  milestone: {
    DRAFT: "bg-gray-500/20 text-gray-300",
    LIVE: "bg-green-500/20 text-green-300",
    IN_REVIEW: "bg-yellow-500/20 text-yellow-300",
    VERIFIED: "bg-blue-500/20 text-blue-300",
    ELIGIBLE_FOR_PAYOUT: "bg-cyan-500/20 text-cyan-300",
    PAID: "bg-green-500/20 text-green-300",
    REJECTED: "bg-red-500/20 text-red-300",
  },
  audit: {
    VERIFIED: "bg-green-500/20 text-green-300",
    UNDER_REVIEW: "bg-yellow-500/20 text-yellow-300",
    FLAGGED: "bg-red-500/20 text-red-300",
  },
}

export function StatusBadge({ status, variant = "campaign", className }: StatusBadgeProps) {
  const colors = statusColors[variant as keyof typeof statusColors]
  const colorClass = colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-300"

  return (
    <span className={cn("px-3 py-1 rounded-full text-sm font-medium", colorClass, className)}>
      {status.replace(/_/g, " ")}
    </span>
  )
}
