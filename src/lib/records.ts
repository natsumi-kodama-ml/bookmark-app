import { CATEGORIES, type Bookmark, type CategoryId, type VocabWord } from "@/lib/types";
import { formatMonthLabel, monthKey } from "@/lib/format";

export type MonthRecord = {
  key: string;
  label: string;
  articleCount: number;
  wordCount: number;
  categories: Array<{
    id: CategoryId;
    label: string;
    emoji: string;
    articleCount: number;
    wordCount: number;
  }>;
};

export function buildMonthRecords(
  bookmarks: Bookmark[],
  words: VocabWord[],
): MonthRecord[] {
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

  const records: MonthRecord[] = [];
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

    records.push({
      key,
      label: formatMonthLabel(key),
      articleCount: articles.length,
      wordCount: monthWords.length,
      categories,
    });
  }

  return records.sort((a, b) => (a.key < b.key ? 1 : -1));
}
