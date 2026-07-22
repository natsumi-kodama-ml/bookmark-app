import { getDomain } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SiteFavicon({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const domain = getDomain(url);
  if (!domain) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external favicon, not a Next-optimizable asset
    <img
      src={`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`}
      alt=""
      className={cn("size-4 shrink-0 rounded-sm", className)}
      loading="lazy"
    />
  );
}
