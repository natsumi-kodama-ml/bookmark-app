"use client";

import { tagColorClass } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TagFilterBar({
  tags,
  selected,
  onToggle,
  onClear,
}: {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}) {
  if (tags.length === 0) return null;

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
        {tags.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                tagColorClass(tag),
                active
                  ? "ring-2 ring-offset-1 ring-foreground/30"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
