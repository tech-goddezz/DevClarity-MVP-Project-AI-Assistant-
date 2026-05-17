// Small utility functions used across the app.
// Keeping them here means we never repeat the same logic twice.

import type { Language } from "../types";

// Converts a language value like "javascript" into a
// display-friendly label like "JavaScript".
// Simple English: makes the language name look nice on screen.
export function toLanguageLabel(value?: Language | string): string {
  switch (value) {
    case "javascript": return "JavaScript";
    case "typescript": return "TypeScript";
    case "python": return "Python";
    default: return "JavaScript";
  }
}

// Looks at the code the user typed and guesses what
// language it probably is based on keywords.
// Simple English: if your code has "def " or "print(",
// it's probably Python. We auto-select the right language.
export function guessLanguage(input: string): Language {
  const text = input.trim();
  if (
    text.includes("def ") ||
    text.includes("print(") ||
    text.includes("import ")
  ) return "python";

  if (
    text.includes(": string") ||
    text.includes("interface ") ||
    text.includes("type ")
  ) return "typescript";

  return "javascript";
}

// Formats an ISO date string into a readable relative time.
// Simple English: turns "2024-01-15T14:30:00Z" into
// something like "2 minutes ago" or "3 hours ago".
export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}