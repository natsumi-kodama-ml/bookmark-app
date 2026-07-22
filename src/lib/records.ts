import { CATEGORIES, type Bookmark, type CategoryId, type VocabWord } from "@/lib/types";
import { formatMonthLabel, monthKey } from "@/lib/format";

export type MonthRecord = {
  key: string;
  label: string;
  articleCount: number;
  wordCount: number;
  masteredCount: number;
  masteryRate: number;
  articleDelta: number | null;
  wordDelta: number | null;
  categories: Array<{
    id: CategoryId;
    label: string;
    emoji: string;
    articleCount: number;
    wordCount: number;
  }>;
};

export type RecordsSummary = {
  totalArticles: number;
  totalWords: number;
  masteredWords: number;
  masteryRate: number;
  readArticles: number;
};

export type Records = {
  summary: RecordsSummary;
  months: MonthRecord[];
};

export function buildRecords(bookmarks: Bookmark[], words: VocabWord[]): Records {
  const bookmarkById = new Map(bookmarks.map((b) => [b.id, b]));
  const months = new Map<string, { articles: Bookmark[]; words: VocabWord[] }>();

  for (const bookmark of bookmarks) {
    const key = monthKey(bookmark.createdAt);
    if (!months.has(key)) months.set(key, { articles: [], words: [] });
    months.get(key)!.articles.push(bookmark);
  }
  for (const word of words) {
    const key = monthKey(word.createdAt);
    if (!months.has(key)) months.set(key, { articles: [], words: [] });
    months.get(key)!.words.push(word);
  }

  const draft: Omit<MonthRecord, "articleDelta" | "wordDelta">[] = [];
  for (const [key, { articles, words: monthWords }] of months) {
    const categoryCounts = new Map<
      CategoryId,
      { articleCount: number; wordCount: number }
    >();

    for (const article of articles) {
      if (!article.category) continue;
      const entry = categoryCounts.get(article.category) ?? {
        articleCount: 0,
        wordCount: 0,
      };
      entry.articleCount += 1;
      categoryCounts.set(article.category, entry);
    }
    for (const word of monthWords) {
      const source = bookmarkById.get(word.bookmarkId);
      if (!source?.category) continue;
      const entry = categoryCounts.get(source.category) ?? {
        articleCount: 0,
        wordCount: 0,
      };
      entry.wordCount += 1;
      categoryCounts.set(source.category, entry);
    }

    const categories = CATEGORIES.filter((c) => categoryCounts.has(c.id)).map(
      (c) => ({
        id: c.id,
        label: c.label,
        emoji: c.emoji,
        ...categoryCounts.get(c.id)!,
      }),
    );

    const masteredCount = monthWords.filter((w) => w.status === "mastered").length;

    draft.push({
      key,
      label: formatMonthLabel(key),
      articleCount: articles.length,
      wordCount: monthWords.length,
      masteredCount,
      masteryRate:
        monthWords.length === 0
          ? 0
          : Math.round((masteredCount / monthWords.length) * 100),
      categories,
    });
  }

  draft.sort((a, b) => (a.key < b.key ? 1 : -1));

  const monthRecords: MonthRecord[] = draft.map((month, index) => {
    const previous = draft[index + 1];
    return {
      ...month,
      articleDelta: previous ? month.articleCount - previous.articleCount : null,
      wordDelta: previous ? month.wordCount - previous.wordCount : null,
    };
  });

  const totalWords = words.length;
  const masteredWords = words.filter((w) => w.status === "mastered").length;
  const readArticles = bookmarks.filter(
    (b) => b.status === "read" || b.status === "mastered",
  ).length;

  return {
    summary: {
      totalArticles: bookmarks.length,
      totalWords,
      masteredWords,
      masteryRate: totalWords === 0 ? 0 : Math.round((masteredWords / totalWords) * 100),
      readArticles,
    },
    months: monthRecords,
  };
}
