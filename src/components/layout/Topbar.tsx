import type { Language, AnalysisMode } from "../../types";

type TopbarProps = {
  language: Language;
  mode: AnalysisMode;
  onLanguageChange: (lang: Language) => void;
  onModeChange: (mode: AnalysisMode) => void;
};

// The top navigation bar with the language and mode selectors.
// Simple English: this is the bar at the top of the screen
// with the dropdowns. It receives the current values and
// calls back to the parent when the user changes them.

export function Topbar({ language, mode, onLanguageChange, onModeChange }: TopbarProps) {
  return (
    <header className="border-b border-white/5 bg-[#0B1020]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            AI Code Analysis Workspace
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Analyze, review, and improve your code instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <label htmlFor="language-select" className="sr-only">
            Select programming language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="dashboard-select"
            aria-label="Select programming language"
            title="Select programming language"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>

          {/* Mode Selector */}
          <label htmlFor="mode-select" className="sr-only">
            Select analysis mode
          </label>
          <select
            id="mode-select"
            value={mode}
            onChange={(e) => onModeChange(e.target.value as AnalysisMode)}
            className="dashboard-select"
            aria-label="Select analysis mode"
            title="Select analysis mode"
          >
            <option value="fast">Fast AI</option>
            <option value="smart">Smart AI</option>
          </select>
        </div>
      </div>
    </header>
  );
}