"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowSquareOut,
  PencilSimple,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { WordFormDialog } from "@/components/word-form-dialog";
import { CategoryBadge, LevelBadge } from "@/components/badges";
import { StatusSelect } from "@/components/status-select";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useVocabulary } from "@/hooks/use-vocabulary";
import { getDomain, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ArticleDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { bookmarks, updateBookmark, removeBookmark } = useBookmarks();
  const { words, addWord, updateWord, removeWord, removeWordsForBookmark } =
    useVocabulary();

  const bookmark = bookmarks.find((b) => b.id === id);
  const articleWords = words.filter((w) => w.bookmarkId === id);

  if (!bookmark) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center ring-1 ring-foreground/10">
          <p className="font-heading text-base font-semibold">
            記事が見つかりません
          </p>
          <p className="text-sm text-muted-foreground">
            削除された可能性があります。
          </p>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            記事一覧に戻る
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2"
        nativeButton={false}
        render={<Link href="/" />}
      >
        <ArrowLeft className="size-4" />
        記事一覧
      </Button>

      <div className="flex flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-lg leading-snug font-bold">
              {bookmark.title}
            </h1>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              <ArrowSquareOut className="size-4" />
              {getDomain(bookmark.url)} で開く
            </a>
          </div>
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
              onSubmit={(value) => updateBookmark(bookmark.id, value)}
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
                  removeWordsForBookmark(bookmark.id);
                  removeBookmark(bookmark.id);
                  router.push("/");
                }
              }}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge id={bookmark.category} />
          <LevelBadge level={bookmark.level} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <StatusSelect
            value={bookmark.status}
            onChange={(status) =>
              updateBookmark(bookmark.id, {
                title: bookmark.title,
                url: bookmark.url,
                memo: bookmark.memo,
                category: bookmark.category,
                level: bookmark.level,
                status,
              })
            }
          />
          <span className="text-xs text-muted-foreground">
            登録日 {formatDate(bookmark.createdAt)}
          </span>
        </div>

        {bookmark.memo && (
          <div className="flex flex-col gap-1 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground">メモ</p>
            <p className="text-sm whitespace-pre-wrap">{bookmark.memo}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold">New Words</h2>
          <WordFormDialog
            mode="create"
            onSubmit={(value) =>
              addWord({
                word: value.word,
                meaning: value.meaning,
                example: value.example,
                bookmarkId: bookmark.id,
                status: "learning",
              })
            }
            renderTrigger={<Button size="sm" variant="outline" />}
            triggerLabel={
              <>
                <Plus weight="bold" className="size-3.5" />
                単語を追加
              </>
            }
          />
        </div>

        {articleWords.length === 0 ? (
          <p className="rounded-xl bg-card px-4 py-6 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
            まだ単語が登録されていません。この記事で覚えた単語を追加しましょう。
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {articleWords.map((w) => (
              <div
                key={w.id}
                className="flex flex-col gap-1 rounded-xl bg-card p-3 ring-1 ring-foreground/10"
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-sm font-semibold">{w.word}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <WordFormDialog
                      mode="edit"
                      initialValue={{
                        word: w.word,
                        meaning: w.meaning,
                        example: w.example,
                      }}
                      onSubmit={(value) => updateWord(w.id, value)}
                      renderTrigger={
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          aria-label={`${w.word} を編集`}
                        />
                      }
                      triggerLabel={<PencilSimple className="size-3.5" />}
                    />
                    <button
                      type="button"
                      onClick={() => removeWord(w.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`${w.word} を削除`}
                    >
                      <Trash className="size-3.5" />
                    </button>
                  </div>
                </div>
                {w.meaning && (
                  <p className="text-xs text-muted-foreground">{w.meaning}</p>
                )}
                {w.example && (
                  <p className="line-clamp-2 text-xs text-muted-foreground italic">
                    &ldquo;{w.example}&rdquo;
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    updateWord(w.id, {
                      status: w.status === "learning" ? "mastered" : "learning",
                    })
                  }
                  className={cn(
                    "mt-1 w-fit rounded-full px-2 py-0.5 text-[0.65rem] font-medium",
                    w.status === "mastered"
                      ? "bg-[oklch(0.92_0.05_140)] text-[oklch(0.38_0.08_140)]"
                      : "bg-[oklch(0.93_0.005_255)] text-[oklch(0.45_0.01_255)]",
                  )}
                >
                  {w.status === "mastered" ? "習得済み" : "学習中"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
