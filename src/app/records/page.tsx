"use client";

import { useMemo } from "react";
import { BookOpen, CheckCircle, Minus, Target, TrendDown, TrendUp } from "@phosphor-icons/react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useVocabulary } from "@/hooks/use-vocabulary";
import { buildRecords } from "@/lib/records";
import { cn } from "@/lib/utils";

function DeltaTag({ value, unit }: { value: number | null; unit: string }) {
  if (value === null) return null;
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus className="size-3" />
        前月と同じ
      </span>
    );
  }
  const isUp = value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isUp ? "text-[oklch(0.45_0.1_150)]" : "text-[oklch(0.5_0.12_25)]",
      )}
    >
      {isUp ? <TrendUp className="size-3" /> : <TrendDown className="size-3" />}
      前月比{isUp ? "+" : ""}
      {value}
      {unit}
    </span>
  );
}

export default function RecordsPage() {
  const { bookmarks } = useBookmarks();
  const { words } = useVocabulary();

  const { summary, months } = useMemo(
    () => buildRecords(bookmarks, words),
    [bookmarks, words],
  );

  if (months.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10 sm:py-20">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-2xl">
            📝
          </span>
          <p className="font-heading text-base font-semibold">
            学習記録はまだありません
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            記事や単語を登録すると、月ごとの学習履歴がここに表示されます。
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="size-3.5" />
              記事数
            </span>
            <span className="font-heading text-xl font-bold">
              {summary.totalArticles}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="size-3.5" />
              単語数
            </span>
            <span className="font-heading text-xl font-bold">
              {summary.totalWords}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="size-3.5" />
              習得済み
            </span>
            <span className="font-heading text-xl font-bold">
              {summary.masteredWords}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
            <span className="text-xs text-muted-foreground">習得率</span>
            <span className="font-heading text-xl font-bold">
              {summary.masteryRate}%
            </span>
          </div>
        </div>

        {months.map((record) => (
          <div
            key={record.key}
            className="flex flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-base font-bold">
                {record.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {record.articleCount}記事 ・ {record.wordCount}単語
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              {(record.articleDelta !== null || record.wordDelta !== null) && (
                <div className="flex items-center gap-3">
                  <DeltaTag value={record.articleDelta} unit="記事" />
                  <DeltaTag value={record.wordDelta} unit="単語" />
                </div>
              )}
              {record.wordCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  習得率 {record.masteryRate}%（{record.masteredCount}/
                  {record.wordCount}）
                </span>
              )}
            </div>

            {record.wordCount > 0 && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${record.masteryRate}%` }}
                />
              </div>
            )}

            {record.categories.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                {record.categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span>{c.emoji}</span>
                      {c.label}
                    </span>
                    <span className="text-muted-foreground">
                      {c.articleCount}記事 ・ {c.wordCount}単語
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
