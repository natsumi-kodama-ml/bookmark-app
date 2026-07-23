export const CATEGORIES = [
  {
    id: "business-politics",
    label: "Business & Politics",
    emoji: "💼",
    colorClass: "bg-[oklch(0.92_0.045_240)] text-[oklch(0.4_0.08_240)]",
  },
  {
    id: "science-technology",
    label: "Science & Technology",
    emoji: "🔬",
    colorClass: "bg-[oklch(0.92_0.05_190)] text-[oklch(0.38_0.07_190)]",
  },
  {
    id: "health-lifestyle",
    label: "Health & Lifestyle",
    emoji: "🏃",
    colorClass: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.38_0.08_140)]",
  },
  {
    id: "culture-society",
    label: "Culture & Society",
    emoji: "🎭",
    colorClass: "bg-[oklch(0.93_0.05_310)] text-[oklch(0.42_0.1_310)]",
  },
  {
    id: "travel-experiences",
    label: "Travel & Experiences",
    emoji: "✈️",
    colorClass: "bg-[oklch(0.93_0.06_85)] text-[oklch(0.42_0.09_85)]",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getCategory(id: CategoryId | null) {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

export const LEVEL_BANDS = [
  {
    label: "Beginner",
    min: 1,
    max: 3,
    colorClass: "bg-[oklch(0.92_0.005_255)] text-[oklch(0.45_0.01_255)]",
  },
  {
    label: "Intermediate",
    min: 4,
    max: 6,
    colorClass: "bg-[oklch(0.92_0.06_150)] text-[oklch(0.4_0.09_150)]",
  },
  {
    label: "Advanced",
    min: 7,
    max: 8,
    colorClass: "bg-[oklch(0.93_0.08_60)] text-[oklch(0.45_0.1_60)]",
  },
  {
    label: "Proficient",
    min: 9,
    max: 10,
    colorClass: "bg-[oklch(0.91_0.08_20)] text-[oklch(0.45_0.13_20)]",
  },
] as const;

export function getLevelBand(level: number | null) {
  if (level === null) return null;
  return LEVEL_BANDS.find((b) => level >= b.min && level <= b.max) ?? null;
}

export const STATUSES = [
  {
    id: "unread",
    label: "未読",
    colorClass: "bg-[oklch(0.93_0.005_255)] text-[oklch(0.45_0.01_255)]",
  },
  {
    id: "read",
    label: "読了",
    colorClass: "bg-[oklch(0.92_0.05_190)] text-[oklch(0.38_0.07_190)]",
  },
  {
    id: "reviewing",
    label: "復習中",
    colorClass: "bg-[oklch(0.92_0.045_240)] text-[oklch(0.4_0.08_240)]",
  },
  {
    id: "mastered",
    label: "習得済み",
    colorClass: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.38_0.08_140)]",
  },
] as const;

export type StatusId = (typeof STATUSES)[number]["id"];

export function getStatus(id: StatusId) {
  return STATUSES.find((s) => s.id === id) ?? STATUSES[0];
}

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  memo: string;
  category: CategoryId | null;
  level: number | null;
  status: StatusId;
  createdAt: string;
};

export type BookmarkInput = Omit<Bookmark, "id" | "createdAt">;

export const WORD_STATUSES = [
  {
    id: "learning",
    label: "学習中",
    colorClass: "bg-[oklch(0.93_0.005_255)] text-[oklch(0.45_0.01_255)]",
  },
  {
    id: "mastered",
    label: "習得済み",
    colorClass: "bg-[oklch(0.92_0.05_140)] text-[oklch(0.38_0.08_140)]",
  },
] as const;

export type WordStatusId = (typeof WORD_STATUSES)[number]["id"];

export const PARTS_OF_SPEECH = [
  { id: "noun", label: "名詞" },
  { id: "verb", label: "動詞" },
  { id: "adjective", label: "形容詞" },
  { id: "adverb", label: "副詞" },
  { id: "preposition", label: "前置詞" },
  { id: "conjunction", label: "接続詞" },
  { id: "pronoun", label: "代名詞" },
  { id: "interjection", label: "間投詞" },
  { id: "phrase", label: "熟語・フレーズ" },
] as const;

export type PartOfSpeechId = (typeof PARTS_OF_SPEECH)[number]["id"];

export function getPartOfSpeech(id: PartOfSpeechId | null) {
  return PARTS_OF_SPEECH.find((p) => p.id === id) ?? null;
}

export type VocabWord = {
  id: string;
  word: string;
  meaning: string;
  exampleEn: string;
  exampleJa: string;
  partOfSpeech: PartOfSpeechId | null;
  bookmarkId: string;
  status: WordStatusId;
  createdAt: string;
};

export type VocabWordInput = Omit<VocabWord, "id" | "createdAt">;
