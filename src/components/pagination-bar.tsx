"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function PaginationBar({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="前のページ"
      >
        <CaretLeft className="size-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        {page} / {pageCount}
      </span>
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        aria-label="次のページ"
      >
        <CaretRight className="size-4" />
      </Button>
    </div>
  );
}
