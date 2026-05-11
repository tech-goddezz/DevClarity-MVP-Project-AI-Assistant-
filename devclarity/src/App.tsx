import { useState, useRef, useEffect } from "react";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";

import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import {
  Code2,
  Sparkles,
  History,
  BrainCircuit,
  ShieldCheck,
  ChevronRight,
  Bot,
  Loader2,
} from "lucide-react";

type AnalysisResult = {
  code: string;
  id: string;
  score: number;
  language?: string;
  summary: string;
  issues: string[];
  suggestions: string[];
};

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("javascript");

  const [typedSummary, setTypedSummary] = useState("");

  const [displayScore, setDisplayScore] = useState(0);

  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const [mode, setMode] = useState("fast");

  const resultRef = useRef<HTMLDivElement | null>(null);

  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scoreIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const highlightCode = (input: string) => {
    const grammar = Prism.languages[language] || Prism.languages.javascript;

    return Prism.highlight(input, grammar, language);
  };

  const guessLanguage = (input: string) => {
    const text = input.trim();

    if (
      text.includes("def ") ||
      text.includes("import ") ||
      text.includes("print(")
    ) {
      return "python";
    }

    if (
      text.includes(": string") ||
      text.includes("interface ") ||
      text.includes("type ")
    ) {
      return "typescript";
    }

    return "javascript";
  };

  const toLanguageLabel = (value?: string) =>
    value === "javascript"
      ? "JavaScript"
      : value === "typescript"
      ? "TypeScript"
      : value === "python"
      ? "Python"
      : "JavaScript";

  useEffect(() => {
    const savedHistory = localStorage.getItem("devclarity_history");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "devclarity_history",
      JSON.stringify(history)
    );
  }, [history]);

  const clearTypingAnimation = () => {
    if (typingIntervalRef.current !== null) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const clearScoreAnimation = () => {
    if (scoreIntervalRef.current !== null) {
      clearInterval(scoreIntervalRef.current);
      scoreIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTypingAnimation();
      clearScoreAnimation();
    };
  }, []);

  const typeText = (text: unknown) => {
    clearTypingAnimation();

    const safe = typeof text === "string"
      ? text
      : String(text ?? "");

    const chars = [...safe];

    let index = 0;

    setTypedSummary("");

    typingIntervalRef.current = setInterval(() => {
      if (index >= chars.length) {
        clearTypingAnimation();
        return;
      }

      const chunk = chars[index];

      index += 1;

      setTypedSummary((prev) => prev + chunk);
    }, 18);
  };

  const animateScore = (finalScore: number) => {
    clearScoreAnimation();

    let current = 0;

    const target = Math.min(finalScore || 0, 10);

    scoreIntervalRef.current = setInterval(() => {
      current += 0.2;

      setDisplayScore(Math.round(current));

      if (current >= target) {
        setDisplayScore(target);

        clearScoreAnimation();
      }
    }, 30);
  };

  const analyzeCode = async () => {
    clearTypingAnimation();

    clearScoreAnimation();

    setLoading(true);

    setError("");

    setResult(null);

    setTypedSummary("");

    setDisplayScore(0);

    try {
      const response = await fetch(
        "https://devclarity-mvp-project-ai-assistant.onrender.com/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            code,
            language,
            mode,
          }),
        }
      );

      const data = await response.json();

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      if (data.status === "error") {
        setError(data.message);
      } else {
        const resultWithId: AnalysisResult = {
          ...data,
          id: crypto.randomUUID(),
          code,
        };

        setResult(resultWithId);

        setHistory((prev) =>
          [resultWithId, ...prev].slice(0, 10)
        );

        animateScore(data.score);

        typeText(data.summary);

        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch {
      setError("Something went wrong. Check your backend.");
    }

    setLoading(false);
  };

  const scorePercentage = (displayScore / 10) * 100;

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex">

      {/* SIDEBAR */}

      <aside className="hidden lg:flex w-[260px] border-r border-white/5 bg-[#0B1020]/80 backdrop-blur-xl flex-col justify-between p-6">

        <div>

          <div className="flex items-center gap-3 mb-10">

            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
              <Code2 size={20} className="text-indigo-300" />
            </div>

            <div>
              <h1 className="font-semibold text-lg">
                DevClarity
              </h1>

              <p className="text-xs text-slate-400">
                AI Code Intelligence
              </p>
            </div>

          </div>

          <div className="space-y-3">

            <div className="sidebar-item-active">
              <Sparkles size={18} />
              Analyze Code
            </div>

            <div className="sidebar-item">
              <History size={18} />
              History
            </div>

            <div className="sidebar-item">
              <BrainCircuit size={18} />
              Smart Analysis
            </div>

            <div className="sidebar-item">
              <ShieldCheck size={18} />
              Best Practices
            </div>

          </div>

        </div>

        <div className="glass-card p-4">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Bot className="text-cyan-300" size={18} />
            </div>

            <div>
              <h4 className="text-sm font-medium">
                AI Assistant
              </h4>

              <p className="text-xs text-slate-400">
                Powered by Groq
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Analyze and improve your code using advanced AI models.
          </p>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 overflow-hidden">

        {/* TOPBAR */}

        <div className="border-b border-white/5 bg-[#0B1020]/60 backdrop-blur-xl">

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

              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
                className="dashboard-select"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="dashboard-select"
              >
                <option value="fast">Fast AI</option>
                <option value="smart">Smart AI</option>
              </select>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* HERO */}

          <div className="glass-card p-8 mb-8 relative overflow-hidden">

            <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-r from-indigo-500/20 via-cyan-500/10 to-transparent" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mb-5">
                <Sparkles size={14} />
                AI-Powered Developer Tool
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
                Understand and improve your code with intelligent AI analysis.
              </h1>

              <p className="text-slate-400 mt-5 max-w-2xl leading-relaxed">
                DevClarity reviews your code, detects issues, and provides actionable improvements instantly using advanced language models.
              </p>

            </div>

          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">

            {/* LEFT */}

            <div>

              {/* EDITOR */}

              <div className="glass-card overflow-hidden">

                <div className="border-b border-white/5 px-5 py-4 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>

                    <p className="text-sm text-slate-400">
                      main.{language === "python"
                        ? "py"
                        : language === "typescript"
                        ? "ts"
                        : "js"}
                    </p>

                  </div>

                  <div className="text-xs text-slate-500">
                    AI-ready editor
                  </div>

                </div>

                <Editor
                  value={code}
                  onValueChange={(nextCode) => {
                    setCode(nextCode);

                    if (!result) {
                      setLanguage(guessLanguage(nextCode));
                    }
                  }}
                  highlight={highlightCode}
                  padding={24}
                  textareaId="code-editor"
                  placeholder="Paste your code here..."
                  className="text-sm min-h-[520px] font-mono focus:outline-none"
                  style={{
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    color: "#e2e8f0",
                    background: "transparent",
                  }}
                />

              </div>

              {/* ACTION */}

              <div className="mt-6 flex items-center gap-4">

                <button
                  className="analyze-btn"
                  onClick={analyzeCode}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Code
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-sm text-slate-500">
                  Current mode: {mode === "fast" ? "Fast AI" : "Smart AI"}
                </p>

              </div>

              {error && (
                <div className="mt-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

            </div>

            {/* RIGHT */}

            <div className="space-y-6">

              {/* SCORE */}

              {result && (
                <div
                  ref={resultRef}
                  className="glass-card p-6"
                >

                  <div className="flex items-center justify-between mb-6">

                    <div>
                      <h3 className="text-lg font-semibold">
                        AI Analysis
                      </h3>

                      <p className="text-sm text-slate-400">
                        {toLanguageLabel(result.language)}
                      </p>
                    </div>

                    <div className="relative w-24 h-24">

                      <svg className="w-24 h-24 rotate-[-90deg]">

                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="8"
                          fill="transparent"
                        />

                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={251}
                          strokeDashoffset={
                            251 - (251 * scorePercentage) / 100
                          }
                          strokeLinecap="round"
                        />

                        <defs>
                          <linearGradient id="gradient">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>

                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-bold">
                          {displayScore}
                        </span>

                        <span className="text-xs text-slate-400">
                          /10
                        </span>
                      </div>

                    </div>

                  </div>

                  <div className="mb-6">

                    <h4 className="text-sm font-medium text-slate-300 mb-2">
                      Summary
                    </h4>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {typedSummary}
                    </p>

                  </div>

                  {result.issues?.length > 0 && (
                    <div className="mb-6">

                      <h4 className="text-sm font-medium text-red-300 mb-3">
                        Issues
                      </h4>

                      <div className="space-y-3">
                        {result.issues.map((item, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl border border-red-500/10 bg-red-500/5 text-sm text-slate-300"
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  <div>

                    <h4 className="text-sm font-medium text-cyan-300 mb-3">
                      Suggestions
                    </h4>

                    <div className="space-y-3">
                      {result.suggestions.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-cyan-500/10 bg-cyan-500/5 text-sm text-slate-300"
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

              {/* HISTORY */}

              <div className="glass-card p-5">

                <div className="flex items-center justify-between mb-4">

                  <h3 className="text-sm font-semibold text-slate-200">
                    Recent Analyses
                  </h3>

                  <button
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem("devclarity_history");
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    Clear
                  </button>

                </div>

                {history.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No analysis history yet.
                  </p>
                ) : (
                  <div className="space-y-3">

                    {history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setResult(item);

                          setCode(item.code);

                          setLanguage(item.language || "javascript");

                          typeText(item.summary);

                          animateScore(item.score);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition"
                      >

                        <div className="flex items-center justify-between mb-2">

                          <p className="text-sm font-medium text-white">
                            {item.score}/10
                          </p>

                          <span className="text-xs text-slate-500">
                            {toLanguageLabel(item.language)}
                          </span>

                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {item.summary}
                        </p>

                      </button>
                    ))}

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;