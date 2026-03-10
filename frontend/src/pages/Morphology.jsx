import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/morphology.css";
import MorphologyTree from "../components/MorphologyTree";

const Morphology = () => {

  const [words,setWords] = useState({});
  const [rootWord,setRootWord] = useState("");

  const [tableData,setTableData] = useState([
    {delete:"None",add:"None",number:"Singular",case:"Direct"},
    {delete:"None",add:"None",number:"Singular",case:"Oblique"},
    {delete:"None",add:"None",number:"Plural",case:"Direct"},
    {delete:"None",add:"None",number:"Plural",case:"Oblique"}
  ]);

  const [showAnswer,setShowAnswer] = useState(false);

  /* ---------- FETCH WORDS ---------- */

  useEffect(()=>{

    axios.get("http://127.0.0.1:8000/morphology/words")
      .then(res=>{
        setWords(res.data.words);
        const firstWord = Object.keys(res.data.words)[0];
        setRootWord(firstWord);
      })
      .catch(err=>{
        console.log(err);
      });

  },[]);

  /* ---------- HANDLE CHANGE ---------- */

  const handleChange=(index,field,value)=>{

    const newData=[...tableData];
    newData[index][field]=value;
    setTableData(newData);

  };

  /* ---------- GENERATE WORD ---------- */

  const generateWord=(root,del,add)=>{

    let base=root;

    if(del!=="None"){
      base=root.slice(0,root.length-del.length);
    }

    if(add!=="None"){
      base=base+add;
    }

    return base;

  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit=()=>{

    const rule = words[rootWord];

    const correctTable = [
      {delete:"None",add:"None",number:"Singular",case:"Direct"},
      {delete:"None",add:"None",number:"Singular",case:"Oblique"},
      {delete:rule.delete,add:rule.add,number:"Plural",case:"Direct"},
      {delete:rule.delete,add:rule.add,number:"Plural",case:"Oblique"}
    ];

    const correct =
      JSON.stringify(tableData) === JSON.stringify(correctTable);

    if(correct){
      alert("✅ Correct Answer");
    }
    else{
      alert("❌ Incorrect Answer");
    }

  };

  /* ---------- RESET ---------- */

  const handleReset=()=>{

    setShowAnswer(false);

    setTableData([
      {delete:"None",add:"None",number:"Singular",case:"Direct"},
      {delete:"None",add:"None",number:"Singular",case:"Oblique"},
      {delete:"None",add:"None",number:"Plural",case:"Direct"},
      {delete:"None",add:"None",number:"Plural",case:"Oblique"}
    ]);

  };

  const rule = words[rootWord] || {delete:"None",add:"s"};

  const pluralWord = generateWord(rootWord,rule.delete,rule.add);

  const rootAfterDelete =
    rule.delete==="None"
      ? rootWord
      : rootWord.slice(0,rootWord.length-rule.delete.length);

  return(

    <div className="morph-container">

      <h1 className="title">Morphological Analysis Lab</h1>

      <div className="grid-container">

        {/* LEFT PANEL */}

        <div className="card">

          <h3>Select Root Word</h3>

          <label>Root Word</label>

          <select
            value={rootWord}
            onChange={(e)=>setRootWord(e.target.value)}
          >

          {Object.keys(words).map((word)=>(
            <option key={word} value={word}>
              {word}
            </option>
          ))}

          </select>

          <h4>Paradigm Table Structure</h4>

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
              <tr>
                <td>Root Ending</td>
                <td>Suffix</td>
                <td>Singular / Plural</td>
                <td>Direct / Oblique</td>
              </tr>
            </tbody>

          </table>

        </div>


        {/* CENTER PANEL */}

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

            {tableData.map((row,index)=>(
              <tr key={index}>

                <td>
                  <select
                    value={row.delete}
                    onChange={(e)=>handleChange(index,"delete",e.target.value)}
                  >
                    <option>None</option>
                    <option>y</option>
                    <option>f</option>
                  </select>
                </td>

                <td>
                  <select
                    value={row.add}
                    onChange={(e)=>handleChange(index,"add",e.target.value)}
                  >
                    <option>None</option>
                    <option>s</option>
                    <option>es</option>
                    <option>ies</option>
                    <option>ves</option>
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

          <button className="btn submit" onClick={handleSubmit}>
            Submit
          </button>

          <button
            className="btn answer"
            onClick={()=>setShowAnswer(true)}
          >
            Get Answer
          </button>

          <button
            className="btn reset"
            onClick={handleReset}
          >
            Reset
          </button>

          {showAnswer && (

            <div className="answer-box">

              <h4>
                Correct Add-Delete Table for "{rootWord}"
              </h4>

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

                  <tr>
                    <td>None</td>
                    <td>None</td>
                    <td>Singular</td>
                    <td>Direct</td>
                  </tr>

                  <tr>
                    <td>None</td>
                    <td>None</td>
                    <td>Singular</td>
                    <td>Oblique</td>
                  </tr>

                  <tr>
                    <td>{rule.delete}</td>
                    <td>{rule.add}</td>
                    <td>Plural</td>
                    <td>Direct</td>
                  </tr>

                  <tr>
                    <td>{rule.delete}</td>
                    <td>{rule.add}</td>
                    <td>Plural</td>
                    <td>Oblique</td>
                  </tr>

                </tbody>

              </table>

              <MorphologyTree
                root={rootAfterDelete}
                suffix={rule.add}
                result={pluralWord}
              />

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Morphology;