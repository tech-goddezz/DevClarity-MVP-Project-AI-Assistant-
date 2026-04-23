import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeCode = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (data.status === "error") {
        setError(data.message);
      } else {
        setResult(data.feedback);
      }

    } catch {
      setError("Something went wrong. Check your backend.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 px-4">
      <h1>DevClarity</h1>

    <textarea
      rows={10}
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Paste your code here..."
      className="w-full max-w-2xl p-4 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

      <br /><br />

      <button 
          className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 transition"
          onClick={analyzeCode}
          disabled={loading}
       >

        {loading ? "Analyzing code..." : "Analyze Code"}
      </button>

      <br /><br />


      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-box">
          <h3>Feedback:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;