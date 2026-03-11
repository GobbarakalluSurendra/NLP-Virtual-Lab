import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "../styles/ngrams_smoothing.css";

const NgramsSmoothing = () => {
    const [instructionsOpen, setInstructionsOpen] = useState(true);
    const [corpus, setCorpus] = useState([]);
    const [vocab, setVocab] = useState([]);

    const [histories, setHistories] = useState([]);
    const [probabilities, setProbabilities] = useState(null);

    const [tableVisible, setTableVisible] = useState(false);
    const [userInputs, setUserInputs] = useState({});
    const [validationStatuses, setValidationStatuses] = useState({});
    const [showAnswer, setShowAnswer] = useState(false);

    // Quiz state
    const quizSentence = "I can sit near you".split(" ");
    const [quizInput, setQuizInput] = useState("");
    const [quizStatus, setQuizStatus] = useState("");

    useEffect(() => {
        const fetchCorpus = async () => {
            try {
                const res = await api.get("/ngrams/corpus");
                setCorpus(res.data.corpus);
                setVocab(res.data.vocab.filter(v => v !== "(eos)")); // Removing EOS for visual simplicity matching screenshot
            } catch (err) {
                console.error("Error fetching corpus:", err);
            }
        };
        fetchCorpus();
    }, []);

    const fetchProbs = async () => {
        try {
            const res = await api.get(`/ngrams/probabilities/2?smooth=true`);
            setProbabilities(res.data.probabilities);

            // Filter out EOS histories for UI match with screenshot
            const filteredHistories = res.data.histories.filter(h => h !== "(eos)");
            setHistories(filteredHistories);

            const initialInputs = {};
            filteredHistories.forEach((historyStr) => {
                initialInputs[historyStr] = {};
                vocab.forEach((v) => {
                    initialInputs[historyStr][v] = "0";
                });
            });
            setUserInputs(initialInputs);
            setValidationStatuses({});
            setShowAnswer(false);
            setTableVisible(true);
            setQuizStatus("");
            setQuizInput("");

        } catch (err) {
            console.error(`Error fetching smoothed probabilities:`, err);
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

    const handleCheck = () => {
        if (!probabilities) return;

        const newStatuses = {};
        histories.forEach((historyStr) => {
            newStatuses[historyStr] = {};
            vocab.forEach((word) => {
                const userVal = parseFloat(userInputs[historyStr][word] || "0");
                const actualVal = parseFloat(probabilities[historyStr]?.[word] || 0);

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
        setQuizInput("");
        setQuizStatus("");
    };

    const handleQuizCheck = () => {
        // Correct probability calculation based on the answer matrix
        if (!showAnswer || !probabilities) return;

        let totalProb = 1.0;

        // I | START
        totalProb *= (probabilities[""]?.["i"] || probabilities["(eos)"]?.["i"] || 0);

        for (let i = 0; i < quizSentence.length - 1; i++) {
            const hist = quizSentence[i].toLowerCase();
            const word = quizSentence[i + 1].toLowerCase();
            const p = probabilities[hist]?.[word] || 0;
            totalProb *= p;
        }

        const userVal = parseFloat(quizInput);
        if (userVal > 0 && Math.abs(userVal - totalProb) < 0.0001) {
            setQuizStatus("correct");
        } else {
            setQuizStatus("incorrect");
        }
    };

    // Helper for Quiz UI
    const getQuizData = () => {
        const data = [
            { bigram: "I | START", prob: probabilities?.["(eos)"]?.["i"] || 0 }
        ];

        for (let i = 0; i < quizSentence.length - 1; i++) {
            const hist = quizSentence[i].toLowerCase();
            const word = quizSentence[i + 1].toLowerCase();
            data.push({
                bigram: `${quizSentence[i + 1]} | ${quizSentence[i]}`,
                prob: probabilities?.[hist]?.[word] || 0
            });
        }
        return data;
    }

    return (
        <div className="smoothing-container">
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
                            <li>Select a corpus from the dropdown.</li>
                            <li>Click 'Find Bigram Probabilities' to view the table.</li>
                            <li>Fill in the bigram probabilities based on the corpus sentences using Laplace (Add-1) Smoothing.</li>
                            <li>Use 'Check', 'Show Answer', or 'Reset' as needed.</li>
                            <li>Try the Sentence Probability Quiz at the bottom.</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="main-content">
                <div className="left-panel">
                    <select className="corpus-select">
                        <option value="english">Corpus A</option>
                    </select>

                    <div className="sentences-list">
                        {corpus.map((sentence, idx) => (
                            <div key={idx}>{sentence}</div>
                        ))}
                    </div>

                    {!tableVisible && (
                        <button className="primary-btn" onClick={handleFindProbabilities} style={{ width: "100%" }}>
                            Find Bigram Probabilities
                        </button>
                    )}
                </div>

                <div className="right-panel">
                    {tableVisible && (
                        <div className="table-container">
                            <table className="probabilities-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {vocab.map(v => (
                                            <th key={v}>{v}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {histories.map(historyStr => (
                                        <tr key={historyStr}>
                                            <td>
                                                {historyStr === "" ? "START" : historyStr}
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
                                <>
                                    <div className="success-message">Correct answers shown above.</div>
                                    <div className="quiz-section">
                                        <h3 className="quiz-title">Sentence Probability Quiz</h3>
                                        <div className="quiz-instruction">
                                            Calculate the probability of the sentence: <strong>I can sit near you</strong>
                                        </div>

                                        <table className="quiz-table">
                                            <thead>
                                                <tr>
                                                    <th>Bigram</th>
                                                    <th>Probability</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getQuizData().map((row, idx) => (
                                                    <tr key={idx}>
                                                        <td>{row.bigram}</td>
                                                        <td>{row.prob.toFixed(3)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="quiz-result-input">
                                            <span>Enter the product of all probabilities above:</span>
                                            <input
                                                type="text"
                                                value={quizInput}
                                                onChange={(e) => {
                                                    setQuizInput(e.target.value);
                                                    setQuizStatus("");
                                                }}
                                                className={quizStatus}
                                            />
                                            <button className="primary-btn" style={{ marginBottom: 0 }} onClick={handleQuizCheck}>Check</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NgramsSmoothing;
