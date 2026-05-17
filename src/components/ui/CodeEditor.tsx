import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";
import { ChevronRight, Loader2 } from "lucide-react";
import type { Language } from "../../types";

type Props = {
  code: string;
  language: Language;
  loading: boolean;
  error: string;
  mode: string;
  onChange: (code: string) => void;
  onAnalyze: () => void;
};

// A sample snippet shown to new users so they immediately
// have something to try without needing to paste their own code.
// Simple English: when the editor is empty, a "Try sample"
// button appears. Clicking it fills the editor with this
// example code so the user can see how the analysis works.
const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  console.log(total);
  return total;
}`;

export function CodeEditor({
  code,
  language,
  loading,
  error,
  mode,
  onChange,
  onAnalyze,
}: Props) {
  const highlight = (input: string) => {
    const grammar = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(input, grammar, language);
  };

  const fileExtension =
    language === "python" ? "py" :
    language === "typescript" ? "ts" : "js";

  return (
    <div>
      {/* Editor Card */}
      <div className="glass-card overflow-hidden">

        {/* Editor header — traffic light dots + filename + sample button */}
        <div className="border-b border-white/5 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Decorative dots like a code editor window */}
            <div className="flex gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <p className="text-sm text-slate-400">main.{fileExtension}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">AI-ready editor</span>

            {/* Only show this button when the editor is empty */}
            {!code && (
              <button
                type="button"
                onClick={() => onChange(SAMPLE_CODE)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition border border-indigo-500/20 px-2 py-1 rounded-lg"
                aria-label="Load a sample code snippet"
              >
                Try sample
              </button>
            )}
          </div>
        </div>

        {/* Hidden label for screen readers */}
      <label htmlFor="code-editor" className="sr-only">
        Code editor — paste your code here
      </label>

        {/* The actual code editor component */}
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={highlight}
          padding={24}
          textareaId="code-editor"
          placeholder="Paste your code here and click Analyze..."
          className="text-sm min-h-[400px] font-mono focus:outline-none"
          style={{
            fontFamily: '"Fira Code", "Consolas", monospace',
            color: "#e2e8f0",
            background: "transparent",
          }}
          textareaClassName="focus:outline-none"
        />
      </div>

      {/* Analyze button row */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          className="analyze-btn"
          onClick={onAnalyze}
          disabled={loading}
          aria-label={loading ? "Analyzing your code, please wait" : "Analyze code"}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Code
              <ChevronRight size={18} aria-hidden="true" />
            </>
          )}
        </button>

        {/* Mode label + keyboard shortcut hint */}
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">
            Mode: {mode === "fast" ? "Fast AI" : "Smart AI"}
          </p>

          {/* Keyboard shortcut hint — plain text, no special symbols */}
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 border border-white/5 px-2 py-1 rounded-lg">
            Ctrl + Enter to analyze
          </span>
        </div>
      </div>

      {/* Error message with retry button */}
      {error && (
        <div
          role="alert"
          className="mt-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start justify-between gap-4"
        >
          <p className="text-red-400 text-sm">{error}</p>
          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            className="text-xs text-red-300 hover:text-red-200 transition border border-red-500/20 px-3 py-1.5 rounded-lg flex-shrink-0"
            aria-label="Retry analysis"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}