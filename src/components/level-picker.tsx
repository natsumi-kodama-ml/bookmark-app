"use client";

import { getLevelBand } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVELS = Array.from({ length: 10 }, (_, i) => i + 1);

export function LevelPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1">
        {LEVELS.map((n) => {
          const band = getLevelBand(n);
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(active ? null : n)}
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-medium transition-all",
                band?.colorClass,
                active
                  ? "ring-2 ring-offset-1 ring-foreground/30"
                  : "opacity-50 hover:opacity-100",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      {value !== null && (
        <p className="text-xs text-muted-foreground">
          Lv.{value} · {getLevelBand(value)?.label}
        </p>
      )}
    </div>
  );
}
