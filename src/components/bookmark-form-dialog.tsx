"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/tag-input";
import type { BookmarkInput } from "@/lib/types";

const EMPTY_VALUE: BookmarkInput = { title: "", url: "", memo: "", tags: [] };

export function BookmarkFormDialog({
  mode,
  initialValue,
  onSubmit,
  renderTrigger,
  triggerLabel,
}: {
  mode: "create" | "edit";
  initialValue?: BookmarkInput;
  onSubmit: (value: BookmarkInput) => void;
  renderTrigger: ReactElement;
  triggerLabel: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<BookmarkInput>(initialValue ?? EMPTY_VALUE);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValue(initialValue ?? EMPTY_VALUE);
    }
    setOpen(nextOpen);
  };

  const canSubmit = value.title.trim() !== "" && value.url.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      title: value.title.trim(),
      url: value.url.trim(),
      memo: value.memo.trim(),
      tags: value.tags,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={renderTrigger}>{triggerLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "ブックマークを登録する" : "ブックマークを編集する"}
            </DialogTitle>
            <DialogDescription>
              Daily Newsの記事を保存して、あとで復習しましょう。
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bookmark-title">タイトル</Label>
            <Input
              id="bookmark-title"
              value={value.title}
              onChange={(e) => setValue((v) => ({ ...v, title: e.target.value }))}
              placeholder="例）Why Sleep Matters for Learning"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bookmark-url">URL</Label>
            <Input
              id="bookmark-url"
              type="url"
              value={value.url}
              onChange={(e) => setValue((v) => ({ ...v, url: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bookmark-memo">メモ</Label>
            <Textarea
              id="bookmark-memo"
              value={value.memo}
              onChange={(e) => setValue((v) => ({ ...v, memo: e.target.value }))}
              placeholder="覚えたい単語・表現やレッスンで聞きたいことをメモしましょう"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>タグ</Label>
            <TagInput
              value={value.tags}
              onChange={(tags) => setValue((v) => ({ ...v, tags }))}
              placeholder="タグを入力してEnter（例: Business, Vocabulary）"
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              キャンセル
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {mode === "create" ? "登録する" : "保存する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
