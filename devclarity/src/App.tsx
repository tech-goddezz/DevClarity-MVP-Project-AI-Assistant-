import { useState, useRef, useEffect } from "react";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";


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
  
    if (text.includes(": string") || text.includes("interface ") || text.includes("type ")) {
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

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
  ];

  const languageLabel =
    language === "javascript"
      ? "JavaScript"
      : language === "typescript"
      ? "TypeScript"
      : "Python";
 
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

  // Typing effect: one interval at a time, Unicode-safe character steps
  const typeText = (text: unknown) => {
    clearTypingAnimation();
    const safe = typeof text === "string" ? text : String(text ?? "");
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
    }, 25);
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
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, language })
      });

      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (data.status === "error") {
        setError(data.message);
      } else {
        
        const resultWithId: AnalysisResult = {
          ...data,
          id: crypto.randomUUID(),
          code,
        };
          
          setResult(resultWithId);
          setHistory((prev) => [resultWithId, ...prev].slice(0, 10));

        animateScore(data.score);

        // typing effect
        typeText(data.summary);

        setTimeout(() => {
        resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      }, 100);
      }


    } catch {
      setError("Something went wrong. Check your backend.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] ">
            DevClarity
      </h1>

      <div className="w-full max-w-2xl mb-3 flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm text-slate-300">
            Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setResult(null);
              setTypedSummary("");
              setDisplayScore(0);
              setError("");
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-md px-3 py-1 text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

      <div className="w-full max-w-2xl rounded-xl border border-purple-500/30 bg-slate-900/70 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.05)] overflow-hidden">
    

      <Editor
        value={code}
        onValueChange={(nextCode) => {
          setCode(nextCode);
        
          if (!result) {
            setLanguage(guessLanguage(nextCode));
          }
        }}
        highlight={highlightCode}
        padding={16}
        textareaId="code-editor"
        placeholder="Paste your code here..."
        className="text-sm min-h-[220px] font-mono focus:outline-none"
        style={{
          fontFamily: '"Fira Code", "Consolas", monospace',
          color: "#e2e8f0",
          background: "transparent",
        }}
      />
    </div>

    {!code && (
  <p className="text-slate-400 mt-2 text-sm">
    Paste code above to get AI feedback
  </p>
)}

      <br /><br />

      <button 
          className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 transition"
          onClick={analyzeCode}
          disabled={loading}
       >

        {loading ? "Analyzing code..." : "Analyze Code"}
      </button>

      <p className="mt-2 text-xs text-slate-400">
        Current language mode: {languageLabel}
      </p>

      {loading && (
  <div className="mt-4 text-cyan-400 animate-pulse flex items-center gap-2">
    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
    <span>Analyzing your code with AI...</span>
  </div>
)}

      <br /><br />


      {error && <p className="error">{error}</p>}

     {result && (
      <div 
        ref={resultRef}
        className="result-box mt-8 w-full max-w-2xl p-6 rounded-xl 
        bg-slate-900/60 backdrop-blur-md 
        border border-cyan-500/30 
        shadow-[0_0_25px_rgba(34,211,238,0.1)]"
      >

        {/* the score */}
        <div className="mb-4">
            <h2 className="text-lg font-semibold text-cyan-400">
              AI Score: {displayScore}/10
            </h2>

            <p className="text-xs text-slate-400 mt-1">
            Analyzed as: {toLanguageLabel(result.language || language)}
            </p>

            <p className="text-slate-300 italic">
              <b>Summary:</b> {typedSummary}
            </p>

            {result.score <= 3 && (
              <p className="text-amber-300 text-sm mt-2">
                This result may be low confidence. Try again with a shorter code snippet.
              </p>
            )}
        </div>

        {/* the issues */}
        {result.issues?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-red-400 font-semibold mb-2">Issues</h4>
            <ul className="list-disc pl-5 text-slate-300">
              {result.issues.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* the suggestions */}
        <div>
          <h4 className="text-green-400 font-semibold mb-2">
            Suggestions
          </h4>
          <ul className="list-disc pl-5 text-slate-300">
            {result.suggestions.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      
  </div>
)}

{history.length > 0 && (
  <div className="mt-8 w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900/60 p-4">
    <h3 className="text-sm font-semibold text-slate-200 mb-3">Recent Analyses</h3>

    <ul className="space-y-2">
      {history.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => {
              setResult(item);
              setCode(item.code);
              setLanguage(item.language || "javascript");
              typeText(item.summary);
              animateScore(item.score);
            }}
            className="w-full text-left rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 hover:bg-slate-700/60 transition"
          >
            <p className="text-xs text-slate-300">
              Score: {item.score}/10 • {toLanguageLabel(item.language)}
            </p>
            <p className="text-xs text-slate-400 truncate">{item.summary}</p>
          </button>
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default App;