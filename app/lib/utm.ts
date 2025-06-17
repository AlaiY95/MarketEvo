// app/lib/utm.ts
export function getUTMSource(): string | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("utm_source");
}

export function isFromReddit(): boolean {
  const utmSource = getUTMSource();
  return utmSource === "reddit" || utmSource === "reddit_organic";
}

export function shouldHidePricing(): boolean {
  // Hide pricing if coming from Reddit or other community sources
  const utmSource = getUTMSource();
  const hiddenSources = ["reddit", "reddit_organic", "hackernews", "producthunt"];
  return hiddenSources.includes(utmSource || "");
}
