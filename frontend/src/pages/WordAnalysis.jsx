import { useState } from "react";
import api from "../api/axiosConfig";

export default function WordAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await api.post("/word-analysis/analyze", { text });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend connection error");
    }
  };

  return (
    <div>
      <h2>Word Analysis Simulation</h2>

      <textarea
        rows="6"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
      />

      <br /><br />

      <button onClick={handleAnalyze}>Analyze</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results</h3>
          <p>Characters: {result.characters}</p>
          <p>Words: {result.words}</p>
          <p>Sentences: {result.sentences}</p>

          <h4>Frequency</h4>
          <ul>
            {Object.entries(result.frequency).map(([word, count]) => (
              <li key={word}>
                {word} : {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}