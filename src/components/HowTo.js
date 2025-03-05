import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // ✅ เพิ่มสไตล์

const HowTo = () => {
  const navigate = useNavigate();

  return (
    <div className="howto-container">
      
      <h1>How to Use the Photobooth</h1>
      <p>Follow these simple steps to take amazing photos!</p>

      <div className="steps">
        <div className="step">
          <img src="/photobooth-howto.png" alt="Step 1" className="step-image" style={{ width: "120px", height: "auto" }} />
          <h2>Step 1</h2>
          <p>Click the <strong>START</strong> button to begin.</p>
        </div>

        <div className="step">
          <img src="/Howto2.png" alt="Step 2" className="step-image" style={{ width: "400px", height: "auto" }} />
          <h2>Step 2</h2>
          <p>Choose a filter before starting capture!</p>
        </div>

        <div className="step">
          <img src="/Howto3.png" alt="Step 2" className="step-image" style={{ width: "400px", height: "auto" }} />
          <h2>Step 3</h2>
          <p>Get ready! The countdown will start before capturing.</p>
        </div>

        <div className="step">
          <img src="/Howto4.png" alt="Step 3" className="step-image" style={{ width: "400px", height: "auto" }}/>
          <h2>Step 4</h2>
          <p>Pose for <strong>4 shots</strong> in a row.</p>
        </div>

        <div className="step">
          <img src="/Howto5.png" alt="Step 4" className="step-image" style={{ width: "180px", height: "auto" }} />
          <h2>Step 5</h2>
          <p>Save & share your photo strip!</p>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate("/welcome")}>Back to Home</button>
    </div>
  );
};

export default HowTo;
