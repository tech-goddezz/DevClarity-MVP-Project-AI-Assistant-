import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");


  const handleAnalyze = () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    // simulate AI thinking
    setTimeout(() => {
      setResponse(
        "💡 Suggestion: Break the problem into smaller components, identify inputs/outputs, then implement step-by-step."
      );
      setLoading(false);
    }, 1500);
  };

  

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow  p-6">

        
        <h1 className="text-2xl font-bold text-gray-800">
          DevClarity
        </h1>

        <p className="text-gray-500 mt-1">
          Your AI Developer Thinking Assistant
        </p>


        {/* THE USER'S INPUT */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 mt-6 p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Describe your coding problem..."
        />

        {/* THE BUTTON */}
        <button
          onClick={handleAnalyze}
          className="mt-4 w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
        >
          Analyze Problem
        </button>

        {/* THE LOADING STATE */}
        {loading && (
          <p className="mt-4 text-gray-500">
            DevClarity is thinking...
          </p>
        )}

        {/* THE RESPONSE */}
        {response && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl text-gray-800">
            {response}
          </div>
        )}

      </div>
    </main>
  );
}

export default App;