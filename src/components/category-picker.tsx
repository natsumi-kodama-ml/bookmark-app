"use client";

import { CATEGORIES, type CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryPicker({
  value,
  onChange,
}: {
  value: CategoryId | null;
  onChange: (value: CategoryId | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((c) => {
        const active = value === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(active ? null : c.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
              c.colorClass,
              active
                ? "ring-2 ring-offset-1 ring-foreground/30"
                : "opacity-60 hover:opacity-100",
            )}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
