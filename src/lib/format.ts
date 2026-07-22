export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

const TAG_PALETTE = [
  "bg-[oklch(0.93_0.06_35)] text-[oklch(0.4_0.1_35)]",
  "bg-[oklch(0.92_0.05_140)] text-[oklch(0.38_0.08_140)]",
  "bg-[oklch(0.92_0.045_240)] text-[oklch(0.4_0.08_240)]",
  "bg-[oklch(0.93_0.05_310)] text-[oklch(0.42_0.1_310)]",
  "bg-[oklch(0.93_0.06_85)] text-[oklch(0.42_0.09_85)]",
  "bg-[oklch(0.92_0.05_190)] text-[oklch(0.38_0.07_190)]",
];

export function tagColorClass(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}
