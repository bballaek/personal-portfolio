import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../App.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate(); // ✅ ใช้ useNavigate()

  return (
    <div className="background-gradient h-screen flex flex-col justify-center items-center text-center">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p>
          At <strong>Capturing</strong>, your privacy is a top priority. We do not track, collect, or store any personal data.
        </p>
        <p>
          All photos taken are processed locally on your device and are not uploaded or saved to any external server.
        </p>
        <p>
          We respect your privacy and are committed to protecting it. No cookies or trackers are used on this site.
        </p>
        <p>
          bballaek
        </p>
        {/* ✅ ใช้ navigate() ให้ถูกต้อง */}
        <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
