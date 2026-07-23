import {
  getCategory,
  getLevelBand,
  getPartOfSpeech,
  type CategoryId,
  type PartOfSpeechId,
} from "@/lib/types";
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

export function PartOfSpeechBadge({ id }: { id: PartOfSpeechId | null }) {
  const pos = getPartOfSpeech(id);
  if (!pos) return null;
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {pos.label}
    </span>
  );
}
