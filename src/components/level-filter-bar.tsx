"use client";

import { LEVEL_BANDS } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LevelFilterBar({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[];
  onToggle: (label: string) => void;
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
          すべてのレベル
        </button>
        {LEVEL_BANDS.map((band) => {
          const active = selected.includes(band.label);
          return (
            <button
              key={band.label}
              type="button"
              onClick={() => onToggle(band.label)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
                band.colorClass,
                active
                  ? "ring-2 ring-offset-1 ring-foreground/30"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              {band.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
