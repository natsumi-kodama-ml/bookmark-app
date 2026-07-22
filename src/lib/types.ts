export type Bookmark = {
  id: string;
  title: string;
  url: string;
  memo: string;
  tags: string[];
  createdAt: string;
};

export type BookmarkInput = Omit<Bookmark, "id" | "createdAt">;
