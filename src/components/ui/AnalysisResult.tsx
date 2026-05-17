import { toLanguageLabel } from "../../lib/utils";
import { ScoreRing } from "./ScoreRing";
import type { AnalysisResult } from "../../types";
import { Wand2, Loader2, RotateCcw } from "lucide-react";
import { ShareCard } from "./ShareCard";

type Props = {
  result: AnalysisResult;
  typedSummary: string;
  displayScore: number;
  resultRef: React.RefObject<HTMLDivElement | null>;
  fixedCode: string | null;
  fixing: boolean;
  fixError: string;
  onFix: () => void;
};

// The full analysis result — shown above the editor after analysis.
// Simple English: this is the card that appears at the top
// of the page after you click Analyze Code. It shows the
// score, summary, issues, and suggestions in a clear layout.

export function AnalysisResultPanel({
  result,
  typedSummary,
  displayScore,
  resultRef,
  fixedCode,
  fixing,
  fixError,
  onFix,
}: Props) {
  return (
    <div ref={resultRef} className="glass-card overflow-hidden">

      {/* Header bar with language label, score, and analyzed-at info */}
      <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">
              AI Analysis
            </span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-500">
              {toLanguageLabel(result.language)}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {new Date(result.analyzedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <ScoreRing displayScore={displayScore} />
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-8">

        {/* Summary */}
        <section aria-label="Analysis summary">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Summary
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {typedSummary}
            <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
          </p>
        </section>

        {/* Issues */}
        {result.issues?.length > 0 && (
          <section aria-label="Code issues">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
              Issues found — {result.issues.length}
            </h3>
            <ul className="space-y-2" role="list">
              {result.issues.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-3 rounded-xl border border-red-500/10 bg-red-500/5 text-sm text-slate-300"
                >
                  <span className="text-red-400 font-mono text-xs mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Suggestions */}
        {result.suggestions?.length > 0 && (
          <section aria-label="Improvement suggestions">
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Suggestions — {result.suggestions.length}
            </h3>
            <ul className="space-y-2" role="list">
              {result.suggestions.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-3 rounded-xl border border-cyan-500/10 bg-cyan-500/5 text-sm text-slate-300"
                >
                  <span className="text-cyan-400 font-mono text-xs mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Share card */}
        <ShareCard
          score={result.score}
          language={result.language}
          issueCount={result.issues?.length ?? 0}
        />

        {/* Fix my code section */}
        <section aria-label="AI code fix" className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Fix My Code
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Let AI rewrite your code with the issues fixed
              </p>
            </div>
            <button
              type="button"
              onClick={onFix}
              disabled={fixing}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/20 transition disabled:opacity-50"
              aria-label={fixing ? "Fixing your code, please wait" : "Fix my code with AI"}
            >
              {fixing ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  Fixing...
                </>
              ) : (
                <>
                  <Wand2 size={14} aria-hidden="true" />
                  Fix it
                </>
              )}
            </button>
          </div>

          {fixError && (
            <p role="alert" className="text-xs text-red-400 mb-3">
              {fixError}
            </p>
          )}

          {fixedCode && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                  Fixed Code
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(fixedCode)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition ml-auto flex items-center gap-1"
                  aria-label="Copy fixed code to clipboard"
                >
                  <RotateCcw size={11} aria-hidden="true" />
                  Copy
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                {fixedCode}
              </pre>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}