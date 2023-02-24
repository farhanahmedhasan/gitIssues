import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./index.css";
import "./App.css";
import Issues from "./pages/Issues";
import Details from "./pages/Details";

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" exact element={<Issues />} />
                    <Route path="/issues/:id" element={<Details />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
