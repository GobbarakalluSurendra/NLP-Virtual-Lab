import { Link } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = ({ setSidebarOpen }) => {

  const handleClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Experiments</h2>

      <ul>

        <li>
          <Link to="/word-analysis" onClick={handleClick}>
            1. Word Analysis
          </Link>
        </li>

        <li>
          <Link to="/word-generation" onClick={handleClick}>
            2. Word Generation
          </Link>
        </li>

        <li>
          <Link to="/morphology" onClick={handleClick}>
            3. Morphology
          </Link>
        </li>

        <li>
          <Link to="/ngrams" onClick={handleClick}>
            4. N-Grams
          </Link>
        </li>

        <li>
          <Link to="/pos-tagging" onClick={handleClick}>
            5. POS Tagging - Hidden Markov Model
          </Link>
        </li>

        <li>
          <Link to="/ngrams-smoothing" onClick={handleClick}>
            6. N-Grams Smoothing
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;