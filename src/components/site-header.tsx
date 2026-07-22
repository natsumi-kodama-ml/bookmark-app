"use client";

import { ArrowSquareOut, BookBookmark, DotsThreeVertical } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DAILY_NEWS_URL = "https://eikaiwa.dmm.com/app/daily-news";

export function SiteHeader() {
  return (
    <header className="border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-5 sm:px-6">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10">
          <BookBookmark weight="fill" className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs font-medium tracking-wide text-primary-foreground/70">
            DMM英会話 Daily News
          </p>
          <h1 className="font-heading text-lg leading-tight font-bold">
            ブックマークライブラリ
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="メニュー"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              />
            }
          >
            <DotsThreeVertical weight="bold" className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={
                <a href={DAILY_NEWS_URL} target="_blank" rel="noreferrer noopener" />
              }
            >
              <ArrowSquareOut className="size-4" />
              Daily Newsを開く
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
