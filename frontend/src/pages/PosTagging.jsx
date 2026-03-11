import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "../styles/pos_tagging.css";

const PosTagging = () => {
    const [instructionsOpen, setInstructionsOpen] = useState(true);

    const [corpora, setCorpora] = useState([]);
    const [selectedCorpusId, setSelectedCorpusId] = useState(0);

    const [matricesData, setMatricesData] = useState(null);
    const [userEmission, setUserEmission] = useState({});
    const [userTransition, setUserTransition] = useState({});

    const [validationEmission, setValidationEmission] = useState({});
    const [validationTransition, setValidationTransition] = useState({});

    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const fetchCorpora = async () => {
            try {
                const res = await api.get("/pos-tagging/corpora");
                setCorpora(res.data);
            } catch (err) {
                console.error("Error fetching corpora:", err);
            }
        };
        fetchCorpora();
    }, []);

    useEffect(() => {
        const fetchMatrices = async () => {
            try {
                const res = await api.get(`/pos-tagging/matrices/${selectedCorpusId}`);
                const data = res.data;
                setMatricesData(data);

                const initUserEm = {};
                const initUserTr = {};

                data.tags.forEach(t1 => {
                    initUserEm[t1] = {};
                    data.words.forEach(w => {
                        initUserEm[t1][w] = "";
                    });

                    initUserTr[t1] = {};
                    data.tags.forEach(t2 => {
                        initUserTr[t1][t2] = "";
                    });
                });

                setUserEmission(initUserEm);
                setUserTransition(initUserTr);
                setValidationEmission({});
                setValidationTransition({});
                setShowAnswer(false);

            } catch (err) {
                console.error("Error fetching matrices:", err);
            }
        };
        fetchMatrices();
    }, [selectedCorpusId]);

    const handleEmissionChange = (tag, word, val) => {
        setUserEmission(prev => ({ ...prev, [tag]: { ...prev[tag], [word]: val } }));
        if (validationEmission[tag]?.[word]) {
            setValidationEmission(prev => ({ ...prev, [tag]: { ...prev[tag], [word]: null } }));
        }
    };

    const handleTransitionChange = (t1, t2, val) => {
        setUserTransition(prev => ({ ...prev, [t1]: { ...prev[t1], [t2]: val } }));
        if (validationTransition[t1]?.[t2]) {
            setValidationTransition(prev => ({ ...prev, [t1]: { ...prev[t1], [t2]: null } }));
        }
    };

    const handleCheck = () => {
        if (!matricesData) return;

        const newValEm = {};
        const newValTr = {};

        matricesData.tags.forEach(t1 => {
            newValEm[t1] = {};
            matricesData.words.forEach(w => {
                const userVal = parseFloat(userEmission[t1][w] || "0");
                const trueVal = matricesData.emission_matrix[t1][w];
                if (Math.abs(userVal - trueVal) <= 0.001) newValEm[t1][w] = "correct";
                else newValEm[t1][w] = "incorrect";
            });

            newValTr[t1] = {};
            matricesData.tags.forEach(t2 => {
                const userVal = parseFloat(userTransition[t1][t2] || "0");
                const trueVal = matricesData.transition_matrix[t1][t2];
                if (Math.abs(userVal - trueVal) <= 0.001) newValTr[t1][t2] = "correct";
                else newValTr[t1][t2] = "incorrect";
            });
        });

        setValidationEmission(newValEm);
        setValidationTransition(newValTr);
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleReset = () => {
        if (!matricesData) return;
        const initUserEm = {};
        const initUserTr = {};
        matricesData.tags.forEach(t1 => {
            initUserEm[t1] = {};
            matricesData.words.forEach(w => { initUserEm[t1][w] = ""; });
            initUserTr[t1] = {};
            matricesData.tags.forEach(t2 => { initUserTr[t1][t2] = ""; });
        });
        setUserEmission(initUserEm);
        setUserTransition(initUserTr);
        setValidationEmission({});
        setValidationTransition({});
        setShowAnswer(false);
    };

    return (
        <div className="pos-tagging-container">
            <div className="instructions-panel">
                <div className="instructions-header" onClick={() => setInstructionsOpen(!instructionsOpen)}>
                    <span>Instructions</span>
                    <span>{instructionsOpen ? '▲' : '▼'}</span>
                </div>
                {instructionsOpen && (
                    <div className="instructions-content">
                        <ul>
                            <li>Select a corpus from the dropdown menu.</li>
                            <li>Observe the training sentence.</li>
                            <li>Enter probability values for each state transition and emission in the Markov model simulation.</li>
                            <li>Click "Check" to validate your answers or "Show Answer" to see correct values.</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="main-content">
                <div className="left-panel">
                    <h3 className="left-panel-title">Corpus Selection:</h3>
                    <select
                        className="corpus-select"
                        value={selectedCorpusId}
                        onChange={(e) => setSelectedCorpusId(parseInt(e.target.value))}
                    >
                        {corpora.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <h3 className="left-panel-title">Training Sentence:</h3>
                    {matricesData && (
                        <div className="sentence-display">
                            {matricesData.sentence}
                        </div>
                    )}
                </div>

                <div className="right-panel">
                    {matricesData && (
                        <div className="table-container">
                            <h2 className="table-title">Fill the Emission and Transition Matrices:</h2>

                            <h3 className="table-subtitle">Emission Matrix</h3>
                            <table className="probabilities-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {matricesData.words.map(w => <th key={w}>{w}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {matricesData.tags.map(t => (
                                        <tr key={t}>
                                            <td>{t}</td>
                                            {matricesData.words.map(w => (
                                                <td key={w}>
                                                    <input
                                                        type="text"
                                                        className={`prob-input ${validationEmission[t]?.[w] || ""}`}
                                                        value={userEmission[t]?.[w] || ""}
                                                        onChange={(e) => handleEmissionChange(t, w, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h3 className="table-subtitle">Transition Matrix</h3>
                            <table className="probabilities-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {matricesData.tags.map(t2 => <th key={t2}>{t2}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {matricesData.tags.map(t1 => (
                                        <tr key={t1}>
                                            <td>{t1}</td>
                                            {matricesData.tags.map(t2 => (
                                                <td key={t2}>
                                                    <input
                                                        type="text"
                                                        className={`prob-input ${validationTransition[t1]?.[t2] || ""}`}
                                                        value={userTransition[t1]?.[t2] || ""}
                                                        onChange={(e) => handleTransitionChange(t1, t2, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="action-buttons">
                                <button className="primary-btn" onClick={handleCheck}>Check</button>
                                <button className="primary-btn" onClick={handleShowAnswer}>Show Answer</button>
                                <button className="primary-btn" onClick={handleReset}>Reset</button>
                            </div>

                            {showAnswer && (
                                <>
                                    <h3 className="table-subtitle">Correct Emission Matrix</h3>
                                    <table className="probabilities-table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                {matricesData.words.map(w => <th key={w}>{w}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matricesData.tags.map(t => (
                                                <tr key={t}>
                                                    <td>{t}</td>
                                                    {matricesData.words.map(w => (
                                                        <td key={w}>
                                                            {matricesData.emission_matrix[t][w].toFixed(2)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <h3 className="table-subtitle">Correct Transition Matrix</h3>
                                    <table className="probabilities-table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                {matricesData.tags.map(t2 => <th key={t2}>{t2}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {matricesData.tags.map(t1 => (
                                                <tr key={t1}>
                                                    <td>{t1}</td>
                                                    {matricesData.tags.map(t2 => (
                                                        <td key={t2}>
                                                            {matricesData.transition_matrix[t1][t2].toFixed(2)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PosTagging;
