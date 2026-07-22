"use client";

import { FunnelSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES, LEVEL_BANDS, type CategoryId } from "@/lib/types";

export function ArticleFilterMenu({
  selectedCategories,
  selectedLevels,
  onToggleCategory,
  onToggleLevel,
  onClear,
}: {
  selectedCategories: CategoryId[];
  selectedLevels: string[];
  onToggleCategory: (id: CategoryId) => void;
  onToggleLevel: (label: string) => void;
  onClear: () => void;
}) {
  const activeCount = selectedCategories.length + selectedLevels.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="shrink-0" />}>
        <FunnelSimple className="size-4" />
        絞り込み
        {activeCount > 0 && (
          <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[0.65rem] font-semibold text-accent-foreground">
            {activeCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>カテゴリ</DropdownMenuLabel>
          {CATEGORIES.map((c) => (
            <DropdownMenuCheckboxItem
              key={c.id}
              checked={selectedCategories.includes(c.id)}
              onCheckedChange={() => onToggleCategory(c.id)}
            >
              <span>{c.emoji}</span>
              {c.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>レベル</DropdownMenuLabel>
          {LEVEL_BANDS.map((band) => (
            <DropdownMenuCheckboxItem
              key={band.label}
              checked={selectedLevels.includes(band.label)}
              onCheckedChange={() => onToggleLevel(band.label)}
            >
              {band.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {activeCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClear}>
              絞り込みをクリア
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
