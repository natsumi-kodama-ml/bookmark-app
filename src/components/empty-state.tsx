"use client";

import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { OpenBookIllustration } from "@/components/illustrations/open-book";
import type { BookmarkInput } from "@/lib/types";

export function EmptyLibraryState({
  onSubmit,
}: {
  onSubmit: (value: BookmarkInput) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-16 text-center shadow-sm sm:py-20">
      <OpenBookIllustration className="h-16 w-20 text-foreground" />
      <div className="flex flex-col gap-1.5">
        <p className="font-heading text-base font-semibold">
          まだ記事は登録されていません
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Daily Newsで気になった記事を登録して、あとで復習できるようにしましょう。
        </p>
      </div>
      <BookmarkFormDialog
        mode="create"
        onSubmit={onSubmit}
        renderTrigger={
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          />
        }
        triggerLabel={
          <>
            <Plus weight="bold" className="size-4" />
            記事を登録する
          </>
        }
      />
    </div>
  );
}

export function EmptySearchState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center shadow-sm">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MagnifyingGlass className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-sm font-semibold">
          該当する記事がありません
        </p>
        <p className="text-sm text-muted-foreground">
          キーワードを変えるか、カテゴリ・レベルの絞り込みを解除してみましょう。
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        検索条件をクリア
      </Button>
    </div>
  );
}
