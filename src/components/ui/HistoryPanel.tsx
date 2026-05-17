import { toLanguageLabel, timeAgo } from "../../lib/utils";
import type { AnalysisResult } from "../../types";

type Props = {
  history: AnalysisResult[];
  onSelect: (item: AnalysisResult) => void;
  onClear: () => void;
};

// The history panel showing previous analyses.
// Simple English: this is the card that lists all the
// code snippets you've analyzed before. Click one to
// bring it back to the main view.

export function HistoryPanel({ history, onSelect, onClear }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Recent Analyses
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 transition"
            aria-label="Clear all analysis history"
          >
            Clear
          </button>
        )}
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-slate-500">No analyses yet.</p>
          <p className="text-xs text-slate-600 mt-1">
            Your history will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition"
                aria-label={`Load analysis: score ${item.score}/10, ${toLanguageLabel(item.language)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {item.score}/10
                  </span>
                  <span className="text-xs text-slate-500">
                    {toLanguageLabel(item.language)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-1">
                  {item.summary}
                </p>
                {/* Shows how long ago this analysis was done */}
                <span className="text-xs text-slate-600">
                  {timeAgo(item.analyzedAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}