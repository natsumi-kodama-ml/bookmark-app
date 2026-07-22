"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Bookmark, BookmarkInput, CategoryId } from "@/lib/types";

const STORAGE_KEY = "daily-news-bookmarks:v2";
const LEGACY_STORAGE_KEY = "daily-news-bookmarks:v1";
const listeners = new Set<() => void>();
const EMPTY: Bookmark[] = [];
let cache: Bookmark[] | null = null;

// v1 stored a free-form `tags: string[]` field instead of category/level/status.
// Map old tags to the closest real category by keyword, so a tag like
// "Science & Technoology" (typo and all) still lands on the right category.
const CATEGORY_KEYWORDS: Record<CategoryId, string[]> = {
  "business-politics": ["business", "politic"],
  "science-technology": ["science", "techno"],
  "health-lifestyle": ["health", "lifestyle"],
  "culture-society": ["culture", "society"],
  "travel-experiences": ["travel", "experience"],
};

function matchCategoryFromTags(tags: unknown): CategoryId | null {
  if (!Array.isArray(tags)) return null;
  const normalized = tags.map((t) => String(t).toLowerCase());
  for (const tag of normalized) {
    for (const [id, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some((keyword) => tag.includes(keyword))) {
        return id as CategoryId;
      }
    }
  }
  return null;
}

function normalize(raw: unknown): Bookmark | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.title !== "string") return null;
  const category =
    typeof r.category === "string"
      ? (r.category as CategoryId)
      : matchCategoryFromTags(r.tags);
  return {
    id: r.id,
    title: r.title,
    url: typeof r.url === "string" ? r.url : "",
    memo: typeof r.memo === "string" ? r.memo : "",
    category,
    level: typeof r.level === "number" ? r.level : null,
    status: typeof r.status === "string" ? (r.status as Bookmark["status"]) : "unread",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
  };
}

function readFromStorage(): Bookmark[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalize).filter((b): b is Bookmark => b !== null);
      }
    }

    // No v2 data yet — migrate from the older free-tag storage if it exists,
    // so articles registered before the category/level rework aren't lost.
    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        const migrated = legacyParsed
          .map(normalize)
          .filter((b): b is Bookmark => b !== null);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }

    return [];
  } catch {
    return [];
  }
}

function getSnapshot(): Bookmark[] {
  if (cache === null) {
    cache = readFromStorage();
  }
  return cache;
}

function getServerSnapshot(): Bookmark[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeBookmarks(next: Bookmark[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  for (const listener of listeners) listener();
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addBookmark = useCallback((input: BookmarkInput) => {
    const bookmark: Bookmark = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeBookmarks([bookmark, ...getSnapshot()]);
    return bookmark;
  }, []);

  const updateBookmark = useCallback((id: string, input: BookmarkInput) => {
    writeBookmarks(
      getSnapshot().map((b) => (b.id === id ? { ...b, ...input } : b)),
    );
  }, []);

  const removeBookmark = useCallback((id: string) => {
    writeBookmarks(getSnapshot().filter((b) => b.id !== id));
  }, []);

  return { bookmarks, addBookmark, updateBookmark, removeBookmark };
}
