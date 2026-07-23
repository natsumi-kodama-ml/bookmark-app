"use client";

import { WORD_STATUSES, type WordStatusId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function WordStatusSelect({
  value,
  onChange,
  className,
}: {
  value: WordStatusId;
  onChange: (value: WordStatusId) => void;
  className?: string;
}) {
  const current = WORD_STATUSES.find((s) => s.id === value) ?? WORD_STATUSES[0];
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as WordStatusId)}
      className={cn(
        "appearance-none rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        current.colorClass,
        className,
      )}
    >
      {WORD_STATUSES.map((s) => (
        <option key={s.id} value={s.id} className="bg-popover text-foreground">
          {s.label}
        </option>
      ))}
    </select>
  );
}
