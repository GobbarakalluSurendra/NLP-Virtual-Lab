import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "../styles/morphology.css";
const Morphology = () => {
  const [language, setLanguage] = useState("english");
  const [category, setCategory] = useState("");
  const [word, setWord] = useState("");
  const [tense, setTense] = useState("");
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const [wordList, setWordList] = useState([]);

  // Word options based on category
  useEffect(() => {
    if (category === "noun") {
      setWordList(["cat", "dog"]);
    } else if (category === "verb") {
      setWordList(["walk", "play"]);
    } else {
      setWordList([]);
    }

    setWord("");
    setTense("");
    setNumber("");
  }, [category]);

  const handleSubmit = async () => {
    try {
      const res = await api.post("/morphology", {
        language,
        word,
        category,
        tense,
        number,
      });

      setResult(res.data.correct);
    } catch (error) {
      setResult("Server Error");
    }
  };

  const handleReset = () => {
    setLanguage("english");
    setCategory("");
    setWord("");
    setTense("");
    setNumber("");
    setResult("");
  };

  return (
    <div className="morph-container">
      <h2 className="title">Morphological Analysis</h2>

      <div className="card-container">
        {/* LEFT CARD */}
        <div className="card">
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
          </select>

          <label>Word</label>
          <select value={word} onChange={(e) => setWord(e.target.value)}>
            <option value="">Select Word</option>
            {wordList.map((w, index) => (
              <option key={index} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* MIDDLE CARD */}
        <div className="card">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
          </select>

          {category === "verb" && (
            <>
              <label>Tense</label>
              <select
                value={tense}
                onChange={(e) => setTense(e.target.value)}
              >
                <option value="">Select Tense</option>
                <option value="past">Past</option>
                <option value="present">Present</option>
              </select>
            </>
          )}

          {category === "noun" && (
            <>
              <label>Number</label>
              <select
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              >
                <option value="">Select Number</option>
                <option value="singular">Singular</option>
                <option value="plural">Plural</option>
              </select>
            </>
          )}
        </div>

        {/* RIGHT CARD */}
        <div className="card">
          <button className="primary-btn" onClick={handleSubmit}>
            ✔ Check Answer
          </button>

          <button className="secondary-btn" onClick={handleReset}>
            🔄 Reset
          </button>

          {result && <p className="result">Result: {result}</p>}
        </div>
      </div>
    </div>
  );
};

export default Morphology;