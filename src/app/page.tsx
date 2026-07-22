"use client";

import { useMemo, useState } from "react";
import { BookBookmark, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { BookmarkCard } from "@/components/bookmark-card";
import { TagFilterBar } from "@/components/tag-filter-bar";
import { EmptyLibraryState, EmptySearchState } from "@/components/empty-state";

export default function Home() {
  const { bookmarks, addBookmark, updateBookmark, removeBookmark } =
    useBookmarks();
  const [keyword, setKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bookmarks) {
      for (const t of b.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [bookmarks]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return bookmarks.filter((b) => {
      const matchesKeyword =
        kw === "" ||
        b.title.toLowerCase().includes(kw) ||
        b.memo.toLowerCase().includes(kw);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => b.tags.includes(t));
      return matchesKeyword && matchesTags;
    });
  }, [bookmarks, keyword, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setKeyword("");
    setSelectedTags([]);
  };

  return (
    <>
      <header className="border-b border-primary/20 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-5 sm:px-6">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10">
            <BookBookmark weight="fill" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-medium tracking-wide text-primary-foreground/70">
              DMM英会話 Daily News
            </p>
            <h1 className="font-heading text-lg leading-tight font-bold">
              ブックマークライブラリ
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {bookmarks.length === 0 ? (
          <EmptyLibraryState onSubmit={addBookmark} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="タイトル・メモを検索"
                  className="pl-8"
                />
              </div>
              <BookmarkFormDialog
                mode="create"
                onSubmit={addBookmark}
                renderTrigger={
                  <Button
                    size="lg"
                    className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                  />
                }
                triggerLabel={
                  <>
                    <Plus weight="bold" className="size-4" />
                    登録する
                  </>
                }
              />
            </div>

            <TagFilterBar
              tags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => setSelectedTags([])}
            />

            {filtered.length === 0 ? (
              <EmptySearchState onClear={clearFilters} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filtered.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onUpdate={(value) => updateBookmark(bookmark.id, value)}
                    onRemove={() => removeBookmark(bookmark.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
