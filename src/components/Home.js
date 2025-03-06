import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const objectElement = document.getElementById("photoautomat-object");

    const onLoadSVG = () => {
      console.log("✅ SVG Loaded!"); // Debugging
      const svgDoc = objectElement?.contentDocument;
      if (!svgDoc) {
        console.error("❌ ไม่สามารถเข้าถึง contentDocument ของ <object> ได้");
        return;
      }

      // 🔹 ตรวจสอบว่าไฟ (light) มีจริงหรือไม่
      const light = svgDoc.getElementById("light");
      if (light) {
        console.log("💡 พบ light:", light);
        let isYellow = true;
        setInterval(() => {
          light.style.setProperty("fill", isYellow ? "#e7e5d5" : "#ffe966", "important");

          isYellow = !isYellow;
          console.log("💡 เปลี่ยนสีเป็น", light.getAttribute("fill"));
        }, 1000); // เปลี่ยนสีทุก 0.5 วินาที
      } else {
        console.error("❌ ไม่พบ light ใน SVG");
      }

      // 🔸 ม่านพริ้ว
      const curtainIds = ["curtain1", "curtain2", "curtain3", "curtain4", "curtain5", "curtain6"];
      curtainIds.forEach((id, index) => {
        const curtain = svgDoc.getElementById(id);
        if (curtain) {
          let direction = index % 2 === 0 ? 1 : -1; // สลับทิศทางการแกว่ง
          setInterval(() => {
            curtain.setAttribute("transform", `translate(${direction * 2}, 0)`);
            direction *= -1;
          }, 1000 + index * 100);
        } else {
          console.error(`❌ ไม่พบม่าน: ${id}`);
        }
      });
    };

    if (objectElement) {
      objectElement.addEventListener("load", onLoadSVG);
    }

    return () => objectElement?.removeEventListener("load", onLoadSVG);
  }, []);

  return (
    <div className="background-gradient h-screen flex flex-col justify-center items-center text-center relative">
      <div className="home-container mt-24">
        <h1 className="text-5xl font-bold text-pink-600 mb-4 font-Phudu">
          Capturing | Booth
        </h1>
        <h4 className="text-lg text-gray-700 mb-6">
          Welcome to Capturing! Photobooth! Lumen & LifeVoyage.
        </h4>

        {/* ✅ ใช้ <object> เพื่อให้ JavaScript ควบคุม SVG ได้ */}
        <object
          id="photoautomat-object"
          type="image/svg+xml"
          data="/photoautomat.svg"
          className="photoautomat-svg"
        />

        <button onClick={() => navigate("/welcome")} className="start-button">
          START
        </button>

        <footer className="mt-8 text-sm text-gray-600 text-center font-kanit">
          <p>Version 1.0.3</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
