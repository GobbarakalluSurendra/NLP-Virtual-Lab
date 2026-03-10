import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/wordanalysis.css";

const WordAnalysis = () => {

  const [wordList, setWordList] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");

  const [features, setFeatures] = useState({
    root: "",
    category: "",
    gender: "",
    number: "",
    person: "",
    script: "",
    case: "",
    tense: ""
  });

  const [answer, setAnswer] = useState(null);

  // Load words from backend
  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/word-analysis/words")
      .then((res) => {
        setWordList(res.data.words);
      })
      .catch((err) => console.log(err));

  }, []);

  // When word changes → fetch correct features
  const handleWordChange = async (e) => {

    const word = e.target.value;
    setSelectedWord(word);

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/word-analysis/features/${word}`
      );

      const data = res.data.features;

      setFeatures({
        root: data.root,
        category: data.category,
        gender: data.gender,
        number: data.number,
        person: data.person,
        script: data.script,
        case: data.case,
        tense: data.tense
      });

    } catch (err) {
      console.log(err);
    }

  };

  const handleChange = (e) => {

    setFeatures({
      ...features,
      [e.target.name]: e.target.value
    });

  };

  const checkAnswer = async () => {

    if (!selectedWord) {
      alert("Please select a word");
      return;
    }

    const res = await axios.get(
      `http://127.0.0.1:8000/word-analysis/features/${selectedWord}`
    );

    const correct = res.data.features;

    let correctFlag = true;

    Object.keys(features).forEach((key) => {

      if (features[key] !== correct[key]) {
        correctFlag = false;
      }

    });

    if (correctFlag) {
      alert("✅ Correct Answer!");
    } else {
      alert("❌ Incorrect Answer");
    }

  };

  const showAnswer = async () => {

    if (!selectedWord) return;

    const res = await axios.get(
      `http://127.0.0.1:8000/word-analysis/features/${selectedWord}`
    );

    setAnswer(res.data.features);

  };

  const resetForm = () => {

    setAnswer(null);

    setFeatures({
      root: "",
      category: "",
      gender: "",
      number: "",
      person: "",
      script: "",
      case: "",
      tense: ""
    });

  };

  return (

    <div className="analysis-container">

      {/* Instructions */}
      <div className="instructions">
        <h3>Instructions</h3>
        <p>
          Select a word and analyze its morphological features.
        </p>
      </div>

      <div className="analysis-grid">

        {/* LEFT PANEL */}
        <div className="card">

          <h3>Start your morphological analysis</h3>

          <label>Language</label>
          <select>
            <option>English</option>
          </select>

          <label>Word</label>
          <select
            value={selectedWord}
            onChange={handleWordChange}
          >

            <option>Select word</option>

            {wordList.map((word) => (

              <option key={word} value={word}>
                {word}
              </option>

            ))}

          </select>

        </div>


        {/* MIDDLE PANEL */}
        <div className="card">

          <h3>Select the correct morphological features</h3>

          <div className="features-grid">

            <div className="field">
              <label>Root</label>
              <select
                name="root"
                value={features.root}
                onChange={handleChange}
              >
                <option value={features.root}>
                  {features.root}
                </option>
              </select>
            </div>

            <div className="field">
              <label>Category</label>
              <select name="category" value={features.category} onChange={handleChange}>
                <option>Noun</option>
                <option>Verb</option>
              </select>
            </div>

            <div className="field">
              <label>Gender</label>
              <select name="gender" value={features.gender} onChange={handleChange}>
                <option>N/A</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="field">
              <label>Number</label>
              <select name="number" value={features.number} onChange={handleChange}>
                <option>Singular</option>
                <option>Plural</option>
              </select>
            </div>

            <div className="field">
              <label>Person</label>
              <select name="person" value={features.person} onChange={handleChange}>
                <option>First</option>
                <option>Second</option>
                <option>Third</option>
              </select>
            </div>

            <div className="field">
              <label>Script</label>
              <select name="script" value={features.script} onChange={handleChange}>
                <option>Roman</option>
                <option>Devanagari</option>
              </select>
            </div>

            <div className="field">
              <label>Case</label>
              <select name="case" value={features.case} onChange={handleChange}>
                <option>Direct</option>
                <option>Oblique</option>
                <option>N/A</option>
              </select>
            </div>

            <div className="field">
              <label>Tense</label>
              <select name="tense" value={features.tense} onChange={handleChange}>
                <option>Present</option>
                <option>Simple-past</option>
                <option>N/A</option>
              </select>
            </div>

          </div>

        </div>


        {/* RIGHT PANEL */}
        <div className="card">

          <h3>Check and Learn</h3>

          <button
            className="btn primary"
            onClick={checkAnswer}
          >
            ✔ Check Answer
          </button>

          <button
            className="btn secondary"
            onClick={showAnswer}
          >
            👁 Show Answer
          </button>

          <button
            className="btn reset"
            onClick={resetForm}
          >
            🔄 Reset
          </button>

          {answer && (

            <div className="answer-box">

              <h4>Correct Features for "{answer.word}"</h4>

              <p><b>Root:</b> {answer.root}</p>
              <p><b>Category:</b> {answer.category}</p>
              <p><b>Gender:</b> {answer.gender}</p>
              <p><b>Number:</b> {answer.number}</p>
              <p><b>Person:</b> {answer.person}</p>
              <p><b>Script:</b> {answer.script}</p>
              <p><b>Case:</b> {answer.case}</p>
              <p><b>Tense:</b> {answer.tense}</p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default WordAnalysis;