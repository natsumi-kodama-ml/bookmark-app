"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "記事一覧", emoji: "📚" },
  { href: "/vocabulary", label: "単語帳", emoji: "🔤" },
  { href: "/records", label: "学習記録", emoji: "📝" },
];

export function TabNav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl gap-1 px-4 sm:px-6">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
