import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // ✅ อัปเดต CSS ด้วย

const filtersList = [
  { name: "No Filter", value: "none" },
  { name: "Grayscale", value: "grayscale(100%)" },
  { name: "Sepia", value: "sepia(100%)" },
  { name: "Vintage", value: "grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)" },
  { name: "Soft", value: "brightness(130%) contrast(105%) saturate(80%) blur(0.3px)" },
  { name: "Warm Glow", value: "contrast(130%) brightness(105%) saturate(120%) hue-rotate(5deg)" },
  { name: "Soft Blur", value: "brightness(105%) contrast(90%) blur(1px) saturate(120%)" },
  { name: "RGB Shift", value: "contrast(110%) brightness(95%) hue-rotate(340deg) drop-shadow(2px 2px 2px rgba(255, 0, 150, 0.3))" },
  { name: "Low-Res", value: "contrast(140%) brightness(90%) saturate(80%)" },
  { name: "Vivid", value: "brightness(110%) contrast(140%) saturate(150%)" }
];

const PhotoBooth = ({ setCapturedImages }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [photosTaken, setPhotosTaken] = useState(0);
  const [startIndex, setStartIndex] = useState(0); // ✅ ควบคุม index ของฟิลเตอร์ที่แสดง

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // "user" = กล้องหน้า, "environment" = กล้องหลัง
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    }
  
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        return;
      }
      const constraints = {
        video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
        videoRef.current.style.transform = "scaleX(-1)";
        videoRef.current.style.objectFit = "cover";
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const startCountdown = () => {
    if (capturing) return;
    setCapturing(true);
    setCountdown("Ready..."); // แสดง Ready... ก่อนเริ่มนับจริง

    setTimeout(() => {
        let timeLeft = 3;
        setCountdown(timeLeft);
        const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            if (timeLeft === 0) {
                clearInterval(timer);
                const imageUrl = capturePhoto();
                if (imageUrl) {
                    setCapturedImages((prevImages) => [...prevImages, imageUrl]);
                    setImages((prevImages) => [...prevImages, imageUrl]);
                }
                setPhotosTaken(prev => prev + 1);
                if (photosTaken + 1 >= 4) {
                    setCapturing(false);
                    setCountdown(null);
                    setTimeout(() => {
                        navigate("/preview");
                    }, 200);
                } else {
                    setCapturing(false);
                    setCountdown(null);
                }
            }
        }, 1000);
    }, 1000); // หน่วงเวลา 1 วินาทีก่อนเริ่มนับ 3 2 1
};


  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      const aspectRatio = videoWidth / videoHeight; // ตรวจจับอัตราส่วน
      
      // ปรับขนาดให้ใกล้เคียง 720p โดยอัตโนมัติ
      const targetWidth = 720;
      const targetHeight = Math.round(targetWidth / aspectRatio);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      context.filter = filter !== "none" ? filter : "none";
      
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      
      context.drawImage(video, 0, 0, targetWidth, targetHeight);
      context.restore();

      return canvas.toDataURL("image/png");
    }
  };


  const nextFilters = () => {
    if (startIndex + 3 < filtersList.length) {
      setStartIndex(startIndex + 3);
    }
  };

  const prevFilters = () => {
    if (startIndex - 3 >= 0) {
      setStartIndex(startIndex - 3);
    }
  };

  return (
    <div className="photo-booth">
      <h1 className="text-5xl font-bold text-pink-600 mb-3 font-Phudu">Start CAPTURING</h1>
      <h3 className="filter-prompt mt-2">
  Scroll down to the Choose a filter before starting capture!
</h3>
<img src="/down.png" alt="photobooth strip" className="photobooth-st filter-prompt"/>
      <div className="photo-container">
        <div className="camera-container">
          {countdown !== null && <h2 className="countdown">{countdown}</h2>}
          <video 
  ref={videoRef} 
  autoPlay 
  playsInline 
  className="video-feed" 
  style={{ filter, objectFit: "cover" }} 
/>
<canvas ref={canvasRef} className="hidden" />

        </div>
      </div>
      <div className="preview-side">
        {capturedImages.map((image, index) => (
          <img key={index} src={image} alt={`Captured ${index + 1}`} className="side-preview" />
        ))}
      </div>

      {/* ✅ ปุ่มถ่ายรูปกลับมาแล้ว */}
      <div className="controls">
        <button onClick={startCountdown} disabled={capturing}>
          {photosTaken === 0 ? "Start Capturing" : capturing ? `Capturing... ${photosTaken + 1}` : `Capture ${photosTaken + 1}`}
        </button>
      </div>
        
      {/* ✅ ปุ่มเลื่อนฟิลเตอร์ */}
      <p className="filter-prompt">Choose a filter before starting capture!</p>
      <div className="filters-container">
        <button className="nav-btn" onClick={prevFilters} disabled={startIndex === 0}>{"<"}</button>
        
        <div className="filters">
          {filtersList.slice(startIndex, startIndex + 3).map((filterItem, index) => (
            <button 
              key={index} 
              onClick={() => setFilter(filterItem.value)} 
              disabled={capturing}
            >
              {filterItem.name}
            </button>
          ))}
        </div>

        <button className="nav-btn" onClick={nextFilters} disabled={startIndex + 3 >= filtersList.length}>{">"}</button>
      </div>

      {/* ✅ Slide Preview กลับมาแล้ว */}
      
    </div>
  );
};

export default PhotoBooth;
