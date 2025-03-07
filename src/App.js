import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // ✅ นำกลับมาใช้
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import PhotoBooth from "./components/PhotoBooth";
import PhotoPreview from "./components/PhotoPreview";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Contact from "./components/Contact";
import HowTo from "./components/HowTo";
import "./menu.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
    <nav className="nav">
      <input
        type="checkbox"
        id="menu-toggle"
        checked={menuOpen}
        onChange={() => setMenuOpen(!menuOpen)}
      />
      <label htmlFor="menu-toggle" className="menu-icon">
        <span></span>
        <span></span>
      </label>
      <div className={`menu ${menuOpen ? "open" : ""}`}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/welcome"
            className={location.pathname === "/welcome" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/privacy-policy"
            className={location.pathname === "/privacy-policy" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Privacy-Policy
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </li>
      </div>
    </nav>
  );
}

function App() {
  const [capturedImages, setCapturedImages] = useState([]);
  const location = useLocation(); // ✅ ใช้ location สำหรับ AnimatePresence

  return (
    <div className="App">
      <Navbar />
      <AnimatePresence mode="wait"> 
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/photobooth" element={<PhotoBooth setCapturedImages={setCapturedImages} />} />
          <Route path="/preview" element={<PhotoPreview capturedImages={capturedImages} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/howto" element={<HowTo />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
