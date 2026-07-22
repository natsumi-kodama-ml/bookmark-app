"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog";
import { BookmarkCard } from "@/components/bookmark-card";
import { CategoryFilterBar } from "@/components/category-filter-bar";
import { LevelFilterBar } from "@/components/level-filter-bar";
import { PaginationBar } from "@/components/pagination-bar";
import { EmptyLibraryState, EmptySearchState } from "@/components/empty-state";
import { getLevelBand, type CategoryId } from "@/lib/types";

const PAGE_SIZE = 10;

export default function ArticlesPage() {
  const { bookmarks, addBookmark, updateBookmark, removeBookmark } =
    useBookmarks();
  const [keyword, setKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    [],
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const toggleCategory = (id: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
    setPage(1);
  };

  const toggleLevel = (label: string) => {
    setSelectedLevels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return bookmarks.filter((b) => {
      const matchesKeyword =
        kw === "" ||
        b.title.toLowerCase().includes(kw) ||
        b.memo.toLowerCase().includes(kw);
      const matchesCategory =
        selectedCategories.length === 0 ||
        (b.category !== null && selectedCategories.includes(b.category));
      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.includes(getLevelBand(b.level)?.label ?? "");
      return matchesKeyword && matchesCategory && matchesLevel;
    });
  }, [bookmarks, keyword, selectedCategories, selectedLevels]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const clearFilters = () => {
    setKeyword("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPage(1);
  };

  return (
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
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
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

          <CategoryFilterBar
            selected={selectedCategories}
            onToggle={toggleCategory}
            onClear={() => {
              setSelectedCategories([]);
              setPage(1);
            }}
          />
          <LevelFilterBar
            selected={selectedLevels}
            onToggle={toggleLevel}
            onClear={() => {
              setSelectedLevels([]);
              setPage(1);
            }}
          />

          {filtered.length === 0 ? (
            <EmptySearchState onClear={clearFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {paged.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onUpdate={(value) => updateBookmark(bookmark.id, value)}
                    onRemove={() => removeBookmark(bookmark.id)}
                    onStatusChange={(status) =>
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
                ))}
              </div>
              <PaginationBar
                page={currentPage}
                pageCount={pageCount}
                onChange={setPage}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}
