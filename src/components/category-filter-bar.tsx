"use client";

import { CATEGORIES, type CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryFilterBar({
  selected,
  onToggle,
  onClear,
}: {
  selected: CategoryId[];
  onToggle: (id: CategoryId) => void;
  onClear: () => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="flex items-center gap-1.5 px-4 sm:px-0">
        <button
          type="button"
          onClick={onClear}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            selected.length === 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          すべて
        </button>
        {CATEGORIES.map((c) => {
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onToggle(c.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all",
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
    </div>
  );
}
