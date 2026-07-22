"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Bookmark, BookmarkInput } from "@/lib/types";

const STORAGE_KEY = "daily-news-bookmarks:v1";
const listeners = new Set<() => void>();
const EMPTY: Bookmark[] = [];
let cache: Bookmark[] | null = null;

function readFromStorage(): Bookmark[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
