"use client";

import { ArrowSquareOut, PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { getDomain, formatDate, tagColorClass } from "@/lib/format";
import type { Bookmark, BookmarkInput } from "@/lib/types";

export function BookmarkCard({
  bookmark,
  onUpdate,
  onRemove,
}: {
  bookmark: Bookmark;
  onUpdate: (value: BookmarkInput) => void;
  onRemove: () => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex flex-1 flex-col gap-0.5"
        >
          <h2 className="font-heading text-sm leading-snug font-semibold group-hover:underline">
            {bookmark.title}
          </h2>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowSquareOut className="size-3.5" />
            {getDomain(bookmark.url)}
          </span>
        </a>
        <div className="flex shrink-0 items-center gap-1">
          <BookmarkFormDialog
            mode="edit"
            initialValue={{
              title: bookmark.title,
              url: bookmark.url,
              memo: bookmark.memo,
              tags: bookmark.tags,
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

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColorClass(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(bookmark.createdAt)}
        </span>
      </div>
    </article>
  );
}
