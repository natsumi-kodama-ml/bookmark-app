"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { VocabWord, VocabWordInput } from "@/lib/types";

const STORAGE_KEY = "daily-news-vocabulary:v1";
const listeners = new Set<() => void>();
const EMPTY: VocabWord[] = [];
let cache: VocabWord[] | null = null;

// Older entries were saved before the `example` field existed.
function normalize(raw: unknown): VocabWord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.word !== "string") return null;
  return {
    id: r.id,
    word: r.word,
    meaning: typeof r.meaning === "string" ? r.meaning : "",
    example: typeof r.example === "string" ? r.example : "",
    bookmarkId: typeof r.bookmarkId === "string" ? r.bookmarkId : "",
    status: r.status === "mastered" ? "mastered" : "learning",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
  };
}

function readFromStorage(): VocabWord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalize).filter((w): w is VocabWord => w !== null);
  } catch {
    return [];
  }
}

function getSnapshot(): VocabWord[] {
  if (cache === null) {
    cache = readFromStorage();
  }
  return cache;
}

function getServerSnapshot(): VocabWord[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeWords(next: VocabWord[]) {
  cache = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  for (const listener of listeners) listener();
}

export function useVocabulary() {
  const words = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addWord = useCallback((input: VocabWordInput) => {
    const word: VocabWord = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    writeWords([word, ...getSnapshot()]);
  }, []);

  const updateWord = useCallback((id: string, input: Partial<VocabWordInput>) => {
    writeWords(
      getSnapshot().map((w) => (w.id === id ? { ...w, ...input } : w)),
    );
  }, []);

  const removeWord = useCallback((id: string) => {
    writeWords(getSnapshot().filter((w) => w.id !== id));
  }, []);

  const removeWordsForBookmark = useCallback((bookmarkId: string) => {
    writeWords(getSnapshot().filter((w) => w.bookmarkId !== bookmarkId));
  }, []);

  return { words, addWord, updateWord, removeWord, removeWordsForBookmark };
}
