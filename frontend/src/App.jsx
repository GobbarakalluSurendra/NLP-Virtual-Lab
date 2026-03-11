import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Morphology from "./pages/Morphology";
import WordAnalysis from "./pages/WordAnalysis";
import WordGeneration from "./pages/WordGeneration";
import Ngrams from "./pages/Ngrams";
import PosTagging from "./pages/PosTagging";
import NgramsSmoothing from "./pages/NgramsSmoothing";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>

      <div style={{ display: "flex" }}>

        {sidebarOpen && (
          <Sidebar setSidebarOpen={setSidebarOpen} />
        )}

        <div style={{ flex: 1, padding: "30px" }}>

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                marginBottom: "20px",
                padding: "8px 14px",
                cursor: "pointer"
              }}
            >
              ☰ Menu
            </button>
          )}

          <Routes>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/morphology" replace />} />

            <Route path="/morphology" element={<Morphology />} />

            {/* Word Analysis Page */}
            <Route path="/word-analysis" element={<WordAnalysis />} />
            <Route path="/word-generation" element={<WordGeneration />} />
            <Route path="/ngrams" element={<Ngrams />} />
            <Route path="/pos-tagging" element={<PosTagging />} />
            <Route path="/ngrams-smoothing" element={<NgramsSmoothing />} />

          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;