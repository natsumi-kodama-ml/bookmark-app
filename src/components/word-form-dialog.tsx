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
import { PARTS_OF_SPEECH, type PartOfSpeechId } from "@/lib/types";

export type WordFormValue = {
  word: string;
  meaning: string;
  exampleEn: string;
  exampleJa: string;
  partOfSpeech: PartOfSpeechId | null;
};

const EMPTY_VALUE: WordFormValue = {
  word: "",
  meaning: "",
  exampleEn: "",
  exampleJa: "",
  partOfSpeech: null,
};

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
      exampleEn: value.exampleEn.trim(),
      exampleJa: value.exampleJa.trim(),
      partOfSpeech: value.partOfSpeech,
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
            <Label htmlFor="word-part-of-speech">品詞</Label>
            <select
              id="word-part-of-speech"
              value={value.partOfSpeech ?? ""}
              onChange={(e) =>
                setValue((v) => ({
                  ...v,
                  partOfSpeech: e.target.value
                    ? (e.target.value as PartOfSpeechId)
                    : null,
                }))
              }
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="">未設定</option>
              {PARTS_OF_SPEECH.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="word-example-en">例文（英語）</Label>
            <Textarea
              id="word-example-en"
              value={value.exampleEn}
              onChange={(e) =>
                setValue((v) => ({ ...v, exampleEn: e.target.value }))
              }
              placeholder="例）She has an unusual occupation."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="word-example-ja">例文（日本語）</Label>
            <Textarea
              id="word-example-ja"
              value={value.exampleJa}
              onChange={(e) =>
                setValue((v) => ({ ...v, exampleJa: e.target.value }))
              }
              placeholder="例）彼女は珍しい職業についている。"
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
