import type { AnalysisMode, AnalysisResult, Language } from "../types";

// We read the backend URL from the environment.
// In development this comes from your .env file.
// In production (Vercel) this comes from the environment
// variables you set in the Vercel dashboard.
const API_BASE = import.meta.env.VITE_API_URL;

type AnalyzePayload = {
  code: string;
  language: Language;
  mode: AnalysisMode;
};

type AnalyzeResponse = Omit<AnalysisResult, "id" | "code" | "analyzedAt">;

// This is the only place in the entire frontend that
// knows how to talk to the backend. No other file needs
// to know the URL or the fetch logic.
export async function analyzeCode(
  payload: AnalyzePayload
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // If the server returns a non-2xx status, throw a real error
  // so our UI can handle it properly instead of silently breaking.
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();

  // The backend sends { status: "error", message: "..." }
  // for validation failures. We treat that as a thrown error too.
  if (data.status === "error") {
    throw new Error(data.message || "Analysis failed");
  }

  return data;
}