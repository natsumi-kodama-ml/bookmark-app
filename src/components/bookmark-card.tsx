"use client";

import Link from "next/link";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { CategoryBadge, LevelBadge } from "@/components/badges";
import { StatusSelect } from "@/components/status-select";
import { SiteFavicon } from "@/components/site-favicon";
import { getDomain, formatDate } from "@/lib/format";
import type { Bookmark, BookmarkInput, StatusId } from "@/lib/types";

export function BookmarkCard({
  bookmark,
  onUpdate,
  onRemove,
  onStatusChange,
}: {
  bookmark: Bookmark;
  onUpdate: (value: BookmarkInput) => void;
  onRemove: () => void;
  onStatusChange: (status: StatusId) => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/articles/${bookmark.id}`} className="group flex flex-1 flex-col gap-0.5">
          <h2 className="font-heading text-sm leading-snug font-semibold group-hover:underline">
            {bookmark.title}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <SiteFavicon url={bookmark.url} />
            {getDomain(bookmark.url)}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <BookmarkFormDialog
            mode="edit"
            initialValue={{
              title: bookmark.title,
              url: bookmark.url,
              memo: bookmark.memo,
              category: bookmark.category,
              level: bookmark.level,
              status: bookmark.status,
            }}
            onSubmit={onUpdate}
            renderTrigger={
              <Button variant="ghost" size="icon-sm" aria-label="編集する" />
            }
            triggerLabel={<PencilSimple className="size-4" />}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="削除する"
            onClick={() => {
              if (window.confirm(`「${bookmark.title}」を削除しますか？`)) {
                onRemove();
              }
            }}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>

      {bookmark.memo && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {bookmark.memo}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge id={bookmark.category} />
        <LevelBadge level={bookmark.level} />
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <StatusSelect value={bookmark.status} onChange={onStatusChange} />
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(bookmark.createdAt)}
        </span>
      </div>
    </article>
  );
}
