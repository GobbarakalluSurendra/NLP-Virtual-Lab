import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "../styles/wordgeneration.css";

function WordGeneration() {

  const [roots, setRoots] = useState([])
  const [root, setRoot] = useState("")

  const [rows, setRows] = useState([
    { delete: "None", add: "None", number: "singular", case: "direct" },
    { delete: "None", add: "None", number: "singular", case: "oblique" },
    { delete: "None", add: "None", number: "plural", case: "direct" },
    { delete: "None", add: "None", number: "plural", case: "oblique" }
  ])

  const [results, setResults] = useState([])
  const [answer, setAnswer] = useState([])

  useEffect(() => {

    api
      .get("/word-generation/roots")
      .then(res => setRoots(res.data.roots))

  }, [])


  const handleChange = (index, field, value) => {

    const updated = [...rows]

    updated[index][field] = value

    setRows(updated)

  }


  const handleSubmit = async () => {

    const res = await axios.post(
      "http://127.0.0.1:8000/word-generation/check",
      {
        root: root,
        rows: rows
      }
    )

    setResults(res.data.results)

  }


  const handleGetAnswer = async () => {

    const res = await axios.get(
      `http://127.0.0.1:8000/word-generation/answer/${root}`
    )

    setAnswer(res.data.table)

  }


  const handleReset = () => {

    setResults([])
    setAnswer([])

    setRows([
      { delete: "None", add: "None", number: "singular", case: "direct" },
      { delete: "None", add: "None", number: "singular", case: "oblique" },
      { delete: "None", add: "None", number: "plural", case: "direct" },
      { delete: "None", add: "None", number: "plural", case: "oblique" }
    ])

  }


  return (

    <div className="wg-container">

      <div className="instructions">
        Instructions
      </div>


      <div className="grid-container">


        {/* LEFT PANEL */}

        <div className="card">

          <h3>Select Root Word</h3>

          <select
            value={root}
            onChange={(e) => setRoot(e.target.value)}
          >

            <option>Select Root</option>

            {roots.map(r => (
              <option key={r}>{r}</option>
            ))}

          </select>


          <h4>Word Forms (Paradigm)</h4>

          <table className="table">

            <thead>
              <tr>
                <th>Word Form</th>
                <th>Root</th>
                <th>Number</th>
                <th>Case</th>
              </tr>
            </thead>

            <tbody>

              {rows.map((row, i) => (

                <tr key={i}>

                  <td>{results[i] === false ? "❌" : ""}</td>

                  <td>{root}</td>
                  <td>{row.number}</td>
                  <td>{row.case}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* MIDDLE PANEL */}

        <div className="card">

          <h3>Fill the Add-Delete Table</h3>

          <table className="table">

            <thead>
              <tr>
                <th>Delete</th>
                <th>Add</th>
                <th>Number</th>
                <th>Case</th>
              </tr>
            </thead>

            <tbody>

              {rows.map((row, i) => (

                <tr key={i}>

                  <td>

                    <select
                      value={row.delete}
                      onChange={(e) => handleChange(i, "delete", e.target.value)}
                    >

                      <option>None</option>
                      <option>y</option>
                      <option>f</option>
                      <option>आ</option>

                    </select>

                  </td>


                  <td>

                    <select
                      value={row.add}
                      onChange={(e) => handleChange(i, "add", e.target.value)}
                    >

                      <option>None</option>
                      <option>s</option>
                      <option>ies</option>
                      <option>ves</option>
                      <option>ए</option>
                      <option>ओं</option>

                    </select>

                  </td>

                  <td>{row.number}</td>
                  <td>{row.case}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* RIGHT PANEL */}

        <div className="card">

          <h3>Check and Learn</h3>

          <button
            className="btn submit"
            onClick={handleSubmit}
          >
            Submit
          </button>


          <button
            className="btn answer"
            onClick={handleGetAnswer}
          >
            Get Answer
          </button>


          <button
            className="btn reset"
            onClick={handleReset}
          >
            Reset
          </button>


          {answer.length > 0 && (

            <div className="answer-box">

              <h4>Correct Table</h4>

              <table className="table">

                <thead>
                  <tr>
                    <th>Delete</th>
                    <th>Add</th>
                    <th>Number</th>
                    <th>Case</th>
                  </tr>
                </thead>

                <tbody>

                  {answer.map((row, i) => (

                    <tr key={i}>

                      <td>{row.delete}</td>
                      <td>{row.add}</td>
                      <td>{row.number}</td>
                      <td>{row.case}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


      </div>

    </div>

  )

}

export default WordGeneration
