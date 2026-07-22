import { getCategory, getLevelBand, type CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({ id }: { id: CategoryId | null }) {
  const category = getCategory(id);
  if (!category) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        category.colorClass,
      )}
    >
      <span>{category.emoji}</span>
      {category.label}
    </span>
  );
}

export function LevelBadge({ level }: { level: number | null }) {
  const band = getLevelBand(level);
  if (level === null || !band) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      Lv.{level}
      <span className="text-muted-foreground/70">・{band.label}</span>
    </span>
  );
}
