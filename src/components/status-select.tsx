"use client";

import { STATUSES, type StatusId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusSelect({
  value,
  onChange,
  className,
}: {
  value: StatusId;
  onChange: (value: StatusId) => void;
  className?: string;
}) {
  const current = STATUSES.find((s) => s.id === value) ?? STATUSES[0];
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as StatusId)}
      className={cn(
        "appearance-none rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        current.colorClass,
        className,
      )}
    >
      {STATUSES.map((s) => (
        <option key={s.id} value={s.id} className="bg-popover text-foreground">
          {s.label}
        </option>
      ))}
    </select>
  );
}
