"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, PencilSimple, PushPin, Trash } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WordFormDialog } from "@/components/word-form-dialog";
import { CollapsibleArchive } from "@/components/collapsible-archive";
import { useVocabulary } from "@/hooks/use-vocabulary";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { formatDate } from "@/lib/format";
import type { VocabWord } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function VocabularyPage() {
  const { words, updateWord, removeWord } = useVocabulary();
  const { bookmarks } = useBookmarks();
  const [keyword, setKeyword] = useState("");

  const bookmarkById = useMemo(
    () => new Map(bookmarks.map((b) => [b.id, b])),
    [bookmarks],
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (kw === "") return words;
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(kw) ||
        w.meaning.toLowerCase().includes(kw),
    );
  }, [words, keyword]);

  const learningWords = useMemo(
    () => filtered.filter((w) => w.status !== "mastered"),
    [filtered],
  );
  const masteredWords = useMemo(
    () => filtered.filter((w) => w.status === "mastered"),
    [filtered],
  );

  const renderWord = (w: VocabWord) => {
    const source = bookmarkById.get(w.bookmarkId);
    return (
      <div
        key={w.id}
        className="flex items-start justify-between gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{w.word}</p>
          {w.meaning && (
            <p className="text-sm text-muted-foreground">{w.meaning}</p>
          )}
          {w.example && (
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{w.example}&rdquo;
            </p>
          )}
          {source && (
            <Link
              href={`/articles/${source.id}`}
              className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              <PushPin className="size-3" />
              {source.title}
            </Link>
          )}
          <span className="text-xs text-muted-foreground">
            登録日 {formatDate(w.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={() =>
              updateWord(w.id, {
                status: w.status === "learning" ? "mastered" : "learning",
              })
            }
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.65rem] font-medium",
              w.status === "mastered"
                ? "bg-[oklch(0.92_0.05_140)] text-[oklch(0.38_0.08_140)]"
                : "bg-[oklch(0.93_0.005_255)] text-[oklch(0.45_0.01_255)]",
            )}
          >
            {w.status === "mastered" ? "習得済み" : "学習中"}
          </button>
          <div className="flex items-center gap-1">
            <WordFormDialog
              mode="edit"
              initialValue={{
                word: w.word,
                meaning: w.meaning,
                example: w.example,
              }}
              onSubmit={(value) => updateWord(w.id, value)}
              renderTrigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${w.word} を編集`}
                />
              }
              triggerLabel={<PencilSimple className="size-4" />}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${w.word} を削除`}
              onClick={() => removeWord(w.id)}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      {words.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10 sm:py-20">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-2xl">
            🔤
          </span>
          <p className="font-heading text-base font-semibold">
            まだ単語が登録されていません
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            記事の詳細ページから、覚えた単語を追加してみましょう。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="単語・意味を検索"
              className="pl-8"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl bg-card px-6 py-12 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
              該当する単語がありません。
            </p>
          ) : (
            <>
              {learningWords.length > 0 && (
                <div className="flex flex-col gap-2">
                  {learningWords.map(renderWord)}
                </div>
              )}

              <CollapsibleArchive
                label="習得済み"
                count={masteredWords.length}
                forceOpen={keyword.trim() !== ""}
              >
                {masteredWords.map(renderWord)}
              </CollapsibleArchive>
            </>
          )}
        </div>
      )}
    </main>
  );
}
