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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type WordFormValue = { word: string; meaning: string; example: string };

const EMPTY_VALUE: WordFormValue = { word: "", meaning: "", example: "" };

export function WordFormDialog({
  mode,
  initialValue,
  onSubmit,
  renderTrigger,
  triggerLabel,
}: {
  mode: "create" | "edit";
  initialValue?: WordFormValue;
  onSubmit: (value: WordFormValue) => void;
  renderTrigger: ReactElement;
  triggerLabel: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<WordFormValue>(initialValue ?? EMPTY_VALUE);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setValue(initialValue ?? EMPTY_VALUE);
    setOpen(nextOpen);
  };

  const canSubmit = value.word.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      word: value.word.trim(),
      meaning: value.meaning.trim(),
      example: value.example.trim(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={renderTrigger}>{triggerLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "単語を追加する" : "単語を編集する"}
            </DialogTitle>
            <DialogDescription>
              この記事で覚えた単語や表現を記録しましょう。
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="word-text">単語・表現</Label>
            <Input
              id="word-text"
              value={value.word}
              onChange={(e) => setValue((v) => ({ ...v, word: e.target.value }))}
              placeholder="例）occupation"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="word-meaning">意味</Label>
            <Input
              id="word-meaning"
              value={value.meaning}
              onChange={(e) => setValue((v) => ({ ...v, meaning: e.target.value }))}
              placeholder="例）職業"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="word-example">例文</Label>
            <Textarea
              id="word-example"
              value={value.example}
              onChange={(e) => setValue((v) => ({ ...v, example: e.target.value }))}
              placeholder="例）She has an unusual occupation."
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              キャンセル
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {mode === "create" ? "追加する" : "保存する"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
