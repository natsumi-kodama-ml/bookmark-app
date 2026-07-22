"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { tagColorClass } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const next = draft.trim();
    setDraft("");
    if (!next || value.includes(next)) return;
    onChange([...value, next]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!next.includes(",")) {
      setDraft(next);
      return;
    }
    const parts = next.split(",");
    const toAdd = parts
      .slice(0, -1)
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && !value.includes(p));
    if (toAdd.length > 0) {
      onChange([...value, ...toAdd]);
    }
    setDraft(parts[parts.length - 1]);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      {value.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            tagColorClass(tag),
          )}
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="opacity-60 hover:opacity-100"
            aria-label={`${tag} を削除`}
          >
            <X size={12} weight="bold" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-24 flex-1 border-0 bg-transparent p-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
