import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { CodeEditor } from "./components/ui/CodeEditor";
import { AnalysisResultPanel } from "./components/ui/AnalysisResult";
import { HistoryPanel } from "./components/ui/HistoryPanel";
import { useAnalysis } from "./hooks/useAnalysis";
import { Sparkles } from "lucide-react";
import { OnboardingBanner } from "./components/ui/OnboardingBanner";
import { AnalysisSkeleton } from "./components/ui/Skeleton";
import { MobileNav } from "./components/layout/MobileNav";
import { HowItWorks } from "./components/ui/HowItWorks";
import { Footer } from "./components/layout/Footer";

// App.tsx is the layout shell only.
// All logic lives in useAnalysis. All UI lives in components.
// Simple English: this file just arranges the pieces on screen.

export default function App() {
  const {
    code,
    result,
    loading,
    error,
    language,
    mode,
    typedSummary,
    displayScore,
    history,
    resultRef,
    setLanguage,
    setMode,
    handleCodeChange,
    runAnalysis,
    loadFromHistory,
    clearHistory,
    fixedCode,
    fixing,
    fixError,
    runFix,
  } = useAnalysis();

  // Controls whether the history panel is open on mobile
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen">
        <Topbar
          language={language}
          mode={mode}
          onLanguageChange={setLanguage}
          onModeChange={setMode}
        />

        <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-6 py-8 pb-28 lg:pb-12 flex flex-col gap-6">

          <OnboardingBanner />

          {/* Hero — only shown before first analysis */}
          {!result && !loading && (
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-r from-indigo-500/20 via-cyan-500/10 to-transparent" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mb-5">
                  <Sparkles size={14} aria-hidden="true" />
                  AI-Powered Developer Tool
                </div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  Understand and improve your code with intelligent AI analysis.
                </h1>
                <p className="text-slate-400 mt-4 leading-relaxed text-sm md:text-base">
                  DevClarity reviews your code, detects issues, and provides
                  actionable improvements instantly.
                </p>
              </div>
            </div>
          )}

          {/* How it works — only shown before first analysis */}
          {!result && !loading && <HowItWorks />}

          {/* Result panel — appears ABOVE the editor after analysis */}
          {loading && <AnalysisSkeleton />}

          {!loading && result && (
            <AnalysisResultPanel
              result={result}
              typedSummary={typedSummary}
              displayScore={displayScore}
              resultRef={resultRef}
              fixedCode={fixedCode}
              fixing={fixing}
              fixError={fixError}
              onFix={runFix}
            />
          )}

          {/* Code editor — always visible */}
          <CodeEditor
            code={code}
            language={language}
            loading={loading}
            error={error}
            mode={mode}
            onChange={handleCodeChange}
            onAnalyze={runAnalysis}
          />

          {/* History toggle button — visible after at least one analysis */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="self-start text-xs text-slate-500 hover:text-slate-300 transition border border-white/5 px-3 py-2 rounded-xl"
              aria-expanded={showHistory ? "true" : "false"}
              aria-controls="history-panel"
            >
              {showHistory ? "Hide history" : `Show history (${history.length})`}
            </button>
          )}

          {/* History panel — collapsible */}
          {showHistory && (
            <div id="history-panel">
              <HistoryPanel
                history={history}
                onSelect={(item) => {
                  loadFromHistory(item);
                  setShowHistory(false);
                }}
                onClear={clearHistory}
              />
            </div>
          )}

        </div>

        <Footer />
      </main>

      <MobileNav />
    </div>
  );
}