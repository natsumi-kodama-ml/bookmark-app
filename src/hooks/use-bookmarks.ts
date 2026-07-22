"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Bookmark, BookmarkInput } from "@/lib/types";

const STORAGE_KEY = "daily-news-bookmarks:v2";
const listeners = new Set<() => void>();
const EMPTY: Bookmark[] = [];
let cache: Bookmark[] | null = null;

// v1 stored a free-form `tags: string[]` field instead of category/level/status.
function normalize(raw: unknown): Bookmark | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.title !== "string") return null;
  return {
    id: r.id,
    title: r.title,
    url: typeof r.url === "string" ? r.url : "",
    memo: typeof r.memo === "string" ? r.memo : "",
    category: typeof r.category === "string" ? (r.category as Bookmark["category"]) : null,
    level: typeof r.level === "number" ? r.level : null,
    status: typeof r.status === "string" ? (r.status as Bookmark["status"]) : "unread",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
  };
}

function readFromStorage(): Bookmark[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalize).filter((b): b is Bookmark => b !== null);
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
