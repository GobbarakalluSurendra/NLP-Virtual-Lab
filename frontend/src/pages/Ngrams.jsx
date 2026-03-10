import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ngrams.css";

const Ngrams = () => {
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [corpus, setCorpus] = useState([]);
  const [vocab, setVocab] = useState([]);
  
  const [nValue, setNValue] = useState(2); // Default to Bigram (n=2)
  const [histories, setHistories] = useState([]);
  const [probabilities, setProbabilities] = useState(null);
  
  const [tableVisible, setTableVisible] = useState(false);
  const [userInputs, setUserInputs] = useState({});
  const [validationStatuses, setValidationStatuses] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchCorpus = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/ngrams/corpus");
        setCorpus(res.data.corpus);
        setVocab(res.data.vocab);
      } catch (err) {
        console.error("Error fetching corpus:", err);
      }
    };
    fetchCorpus();
  }, []);

  const fetchProbs = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/ngrams/probabilities/${nValue}`);
      setProbabilities(res.data.probabilities);
      setHistories(res.data.histories);
      
      // Initialize user inputs based on fetched histories and vocab
      const initialInputs = {};
      res.data.histories.forEach((historyStr) => {
        initialInputs[historyStr] = {};
        vocab.forEach((v) => {
          initialInputs[historyStr][v] = "0"; // Default value shown in screenshot
        });
      });
      setUserInputs(initialInputs);
      setValidationStatuses({});
      setShowAnswer(false);
      setTableVisible(true);
      
    } catch (err) {
      console.error(`Error fetching probabilities for N=${nValue}:`, err);
    }
  };

  const handleInputChange = (historyStr, word, value) => {
    setUserInputs((prev) => ({
      ...prev,
      [historyStr]: {
        ...prev[historyStr],
        [word]: value,
      },
    }));
    
    // Clear validation status for this cell when user edits
    if (validationStatuses[historyStr] && validationStatuses[historyStr][word]) {
      setValidationStatuses(prev => ({
        ...prev,
        [historyStr]: {
          ...prev[historyStr],
          [word]: null
        }
      }));
    }
  };

  const handleFindProbabilities = () => {
    fetchProbs();
  };
  
  const handleNChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setNValue(val);
      setTableVisible(false);
    }
  };

  const handleCheck = () => {
    if (!probabilities) return;
    
    const newStatuses = {};
    histories.forEach((historyStr) => {
      newStatuses[historyStr] = {};
      vocab.forEach((word) => {
        const userVal = parseFloat(userInputs[historyStr][word] || "0");
        const actualVal = parseFloat(probabilities[historyStr]?.[word] || 0);
        
        // Allow a small margin of error for float comparisons
        if (Math.abs(userVal - actualVal) < 0.001) {
          newStatuses[historyStr][word] = "correct";
        } else {
          newStatuses[historyStr][word] = "incorrect";
        }
      });
    });
    
    setValidationStatuses(newStatuses);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleReset = () => {
    // Reset user inputs to "0"
    const resetInputs = {};
    histories.forEach((historyStr) => {
      resetInputs[historyStr] = {};
      vocab.forEach((word) => {
        resetInputs[historyStr][word] = "0";
      });
    });
    setUserInputs(resetInputs);
    setValidationStatuses({});
    setShowAnswer(false);
  };

  return (
    <div className="ngrams-container">
      {/* Instructions Panel */}
      <div className="instructions-panel">
        <div 
          className="instructions-header"
          onClick={() => setInstructionsOpen(!instructionsOpen)}
        >
          <span>Instructions</span>
          <span>{instructionsOpen ? '▲' : '▼'}</span>
        </div>
        
        {instructionsOpen && (
          <div className="instructions-content">
            <ul>
              <li>Select an N-gram size (N=1 for Unigram, N=2 for Bigram, etc).</li>
              <li>Click 'Find Probabilities' to view the generated table.</li>
              <li>Fill in the probabilities based on the corpus sentences.</li>
              <li>Use 'Check', 'Show Answer', or 'Reset' as needed.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="main-content">
        {/* Left Panel - Corpus & Sentences */}
        <div className="left-panel">
          <select className="corpus-select" style={{marginBottom: "10px"}}>
            <option value="english">English Corpus</option>
          </select>
          
          <div style={{marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px"}}>
            <label style={{fontWeight: 600, fontSize: "14px", color: "#475569"}}>N-Gram Size:</label>
            <input 
              type="number" 
              min="1" 
              value={nValue} 
              onChange={handleNChange}
              style={{
                width: "60px", padding: "8px", borderRadius: "6px", 
                border: "1px solid #d1d5db", outline: "none"
              }}
            />
          </div>
          
          <div className="sentences-list">
            {corpus.map((sentence, idx) => (
              <div key={idx}>{sentence}</div>
            ))}
          </div>
        </div>

        {/* Right Panel - Tables and Buttons */}
        <div className="right-panel">
          {!tableVisible && (
            <button 
              className="primary-btn" 
              onClick={handleFindProbabilities}
            >
              Find Probabilities for N={nValue}
            </button>
          )}

          {tableVisible && (
            <div className="table-container">
              <h3 style={{marginTop: 0, marginBottom: "15px", color: "#4b4ef8"}}>
                {nValue === 1 ? "Unigram" : nValue === 2 ? "Bigram" : nValue === 3 ? "Trigram" : `${nValue}-Gram`} Probabilities
              </h3>
              <table className="probabilities-table">
                <thead>
                  <tr>
                    <th>History</th>
                    {vocab.map(v => (
                      <th key={v}>{v}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {histories.map(historyStr => (
                    <tr key={historyStr}>
                      <td style={{fontWeight: 600, backgroundColor: "#f8fafc", color: "#475569"}}>
                        {historyStr === "" ? "()" : `(${historyStr})`}
                      </td>
                      {vocab.map(word => {
                        const status = validationStatuses[historyStr]?.[word] || "";
                        return (
                          <td key={`${historyStr}-${word}`}>
                            <input
                              type="text"
                              className={`prob-input ${status}`}
                              value={userInputs[historyStr]?.[word] || ""}
                              onChange={(e) => handleInputChange(historyStr, word, e.target.value)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="action-buttons">
                <button className="primary-btn" onClick={handleCheck}>Check</button>
                <button className="primary-btn" onClick={handleShowAnswer}>Show Answer</button>
                <button className="primary-btn" onClick={handleReset}>Reset</button>
              </div>

              {showAnswer && probabilities && (
                <div className="answer-table-container">
                  <table className="probabilities-table">
                    <thead>
                      <tr>
                        <th>History</th>
                        {vocab.map(v => (
                          <th key={v}>{v}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {histories.map(historyStr => (
                        <tr key={`ans-row-${historyStr}`}>
                          <td style={{fontWeight: 600, backgroundColor: "#f8fafc", color: "#475569"}}>
                            {historyStr === "" ? "()" : `(${historyStr})`}
                          </td>
                          {vocab.map(word => {
                            let answer = probabilities[historyStr]?.[word] || 0;
                            // Format to 3 decimal places if it has many
                            if (answer % 1 !== 0) {
                              answer = answer.toFixed(3);
                            }
                            return (
                              <td key={`ans-${historyStr}-${word}`}>
                                {answer}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ngrams;
