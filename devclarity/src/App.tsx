import { useState, useRef } from "react";

  type AnalysisResult = {
  score: number;
  summary: string;
  issues: string[];
  suggestions: string[];
};

function App() {

  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const [typedSummary, setTypedSummary] = useState("");

   const [displayScore, setDisplayScore] = useState(0);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // Typing effect function
  const typeText = (text: string) => {
    let index = 0;
    setTypedSummary("");

    const interval = setInterval(() => {
      setTypedSummary((prev) => prev + text[index]);
      index++;

      if (index === text.length) {
        clearInterval(interval);
      }
    }, 25);
  };

  const animateScore = (finalScore: number) => {
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setDisplayScore(current);

      if (current === finalScore) {
        clearInterval(interval);
      }
    }, 100);
  };

  const analyzeCode = async () => {
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
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (data.status === "error") {
        setError(data.message);
      } else {
        setResult(data);

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

    <textarea
      rows={10}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Paste your code here..."
      className="w-full max-w-2xl p-4 rounded-xl 
     bg-slate-900/70 backdrop-blur-md border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.05)] transition"
    />

      <br /><br />

      <button 
          className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 transition"
          onClick={analyzeCode}
          disabled={loading}
       >

        {loading ? "Analyzing code..." : "Analyze Code"}
      </button>

      {loading && (
  <p className="mt-4 text-cyan-400 animate-pulse">
    AI is analyzing your code...
  </p>
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

            <p className="text-slate-300 italic">
              <b>Summary:</b> {typedSummary}
            </p>
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
    </div>
  );
}

export default App;