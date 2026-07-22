"use client";

import { useMemo } from "react";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useVocabulary } from "@/hooks/use-vocabulary";
import { buildMonthRecords } from "@/lib/records";

export default function RecordsPage() {
  const { bookmarks } = useBookmarks();
  const { words } = useVocabulary();

  const records = useMemo(
    () => buildMonthRecords(bookmarks, words),
    [bookmarks, words],
  );

  if (records.length === 0) {
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
        {records.map((record) => (
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
