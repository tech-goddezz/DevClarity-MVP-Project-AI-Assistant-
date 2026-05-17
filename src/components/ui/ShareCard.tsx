import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toLanguageLabel } from "../../lib/utils";
import type { Language } from "../../types";
import toast from "react-hot-toast";

type Props = {
  score: number;
  language: Language;
  issueCount: number;
};


function getScoreLabel(score: number): string {
  if (score >= 8) return "Great code quality";
  if (score >= 6) return "Good code quality";
  if (score >= 4) return "Needs some work";
  return "Needs significant improvement";
}

export function ShareCard({ score, language, issueCount }: Props) {
  const [copied, setCopied] = useState(false);

  const shareText = `Just analyzed my ${toLanguageLabel(language)} code with DevClarity AI.

Score: ${score}/10 — ${getScoreLabel(score)}
Issues found: ${issueCount}

Free AI code analysis: https://dev-clarity-mvp-project-ai-assistan.vercel.app

#DevClarity #CodeReview #100DaysOfCode`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Copied! Ready to share");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy. Try manually.");
    }
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
      <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
        Share your result
      </p>
      <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed mb-3 font-sans">
        {shareText}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 text-xs text-indigo-300 hover:text-indigo-200 transition"
        aria-label={copied ? "Text copied to clipboard" : "Copy share text to clipboard"}
      >
        {copied ? (
          <><Check size={13} aria-hidden="true" /> Copied!</>
        ) : (
          <><Share2 size={13} aria-hidden="true" /> Copy to share</>
        )}
      </button>
    </div>
  );
}