import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import CreatePoll from "./CreatePoll";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Signup from "./Signup";
import ViewPolls from "./ViewPolls";
import Navbar from "./components/Navbar";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("pollwise-theme");
    return storedMode === "dark";
  });

  useEffect(() => {
    localStorage.setItem("pollwise-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <div className="app-background">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Routes>
            <Route
              path="/"
              element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />}
            />
            <Route
              path="/signup"
              element={<Signup darkMode={darkMode} setDarkMode={setDarkMode} />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-poll" element={<CreatePoll />} />
            <Route path="/polls" element={<ViewPolls />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
