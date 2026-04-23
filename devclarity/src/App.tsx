import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const analyzeCode = () => {
    fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    })
      .then((res) => res.json())
      .then((data) => setFeedback(data.feedback))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>DevClarity AI</h1>

      <textarea
        rows={10}
        cols={50}
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeCode}>
        Analyze Code
      </button>

      <h3>Feedback:</h3>
      <p>{feedback}</p>

    </div>
  );
}

export default App;