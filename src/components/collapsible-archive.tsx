"use client";

import { useState, type ReactNode } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";

export function CollapsibleArchive({
  label,
  count,
  forceOpen,
  children,
}: {
  label: string;
  count: number;
  forceOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (count === 0) return null;
  const isOpen = open || !!forceOpen;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {isOpen ? (
          <CaretDown className="size-3.5" />
        ) : (
          <CaretRight className="size-3.5" />
        )}
        {label}（{count}）
      </button>
      {isOpen && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
}
