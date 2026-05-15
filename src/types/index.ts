// This file is the single source of truth for all TypeScript types
// in the frontend. Instead of defining types inside components,
// we define them once here and import them wherever needed.

export type Language = "javascript" | "typescript" | "python";

export type AnalysisMode = "fast" | "smart";

export type AnalysisResult = {
  id: string;
  code: string;
  score: number;
  language: Language;
  summary: string;
  issues: string[];
  suggestions: string[];
  analyzedAt: string; // ISO timestamp so we can show "analyzed 2 mins ago"
};