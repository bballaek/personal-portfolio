import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container h-screen flex  flex-col justify-center items-center text-center">
      {/* รูปภาพ Photobooth */}
      <div className="photobooth-container">
        <img src="/photobooth1.png" alt="photobooth strip" className="photobooth-strip rotated-left" />
        <img src="/photobooth3.png" alt="photobooth strip" className="photobooth-strip rotated-right" />
      </div>

      {/* ข้อความและปุ่ม START */}
      <h1 className="welcome-title">Welcome!</h1>
      <p>
        You have <strong>3 seconds</strong> for each shot – no retakes! <br />
        This photobooth captures <strong>4 pictures</strong> in a row, so strike your best pose and have fun!
      </p>
      <p>
        After the session, <span style={{ color: "pink" }}>download</span> your digital copy and share the fun!
      </p>
      

      <div className="button-container">
      
        <button className="howto-btn" onClick={() => navigate("/howto")}>How to</button>
        <button className="privacypolicy-btn" onClick={() => navigate("/privacy-policy")}>Privacy Policy</button>
        <button button className="start-btn" onClick={() => navigate("/photobooth")}>START</button>


</div>

    </div>
  );
};

export default Welcome;
