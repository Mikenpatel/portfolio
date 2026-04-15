import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { ToolStatus } from "../data/tools";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ToolStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let Icon = CheckCircle;
  let colorClass = "bg-green-500/10 text-green-500 border-green-500/20";

  if (status === "Degraded") {
    Icon = AlertTriangle;
    colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  } else if (status === "Outage") {
    Icon = XCircle;
    colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium uppercase tracking-wider",
        colorClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </div>
  );
}
