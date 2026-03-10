import React from "react";
import "../styles/tree.css";

const MorphologyTree = ({ root, suffix, result }) => {

  if (!result) return null;

  return (
    <div className="tree-container">

      <h3>Morphology Tree</h3>

      <div className="tree">

        <div className="node result">{result}</div>

        <div className="vertical-line"></div>

        <div className="horizontal-line"></div>

        <div className="tree-children">

          <div className="child">
            <div className="node root">{root}</div>
            <span>Root</span>
          </div>

          <div className="child">
            <div className="node suffix">{suffix}</div>
            <span>Suffix</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default MorphologyTree;