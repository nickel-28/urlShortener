import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrls, setShortUrls] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme + saved links on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shortUrls")) || [];
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
    setShortUrls(saved);
    setHasLoaded(true);
  }, []);

  // Save links when changed
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("shortUrls", JSON.stringify(shortUrls));
    }
  }, [shortUrls, hasLoaded]);

  // Save theme and apply class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const generateShortUrl = () => {
    if (!longUrl.trim()) return;
    const randomId = Math.random().toString(36).substring(2, 8);
    const short = `https://short.ly/${randomId}`;
    setShortUrls([...shortUrls, { longUrl, shortUrl: short }]);
    setLongUrl("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="top-bar">
          <h1>Simple URL Shortener</h1>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter a long URL..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <button onClick={generateShortUrl}>Shorten</button>
        </div>

        <div className="result-list">
          {shortUrls.map(({ longUrl, shortUrl }, index) => (
            <div key={index} className="result-item">
              <p>
                <strong>Original:</strong> {longUrl}
              </p>
              <p>
                <strong>Short:</strong>{" "}
                <a href={longUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
                <button onClick={() => copyToClipboard(shortUrl)}>📋</button>
              </p>
            </div>
          ))}

          {shortUrls.length > 0 && (
            <div className="clear-box">
              <p>Manage your saved URLs:</p>
              <div className="button-group">
                <button
                  className="clear-btn"
                  onClick={() => {
                    const updated = [...shortUrls];
                    updated.pop();
                    setShortUrls(updated);
                    localStorage.setItem("shortUrls", JSON.stringify(updated));
                  }}
                >
                  🔙 Clear Last Link
                </button>
                <button
                  className="clear-btn"
                  onClick={() => {
                    setShortUrls([]);
                    localStorage.removeItem("shortUrls");
                  }}
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
