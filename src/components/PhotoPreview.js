import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram } from "lucide-react";
import { MdOutlineFileDownload } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { BsCopy } from "react-icons/bs";
import axios from "axios";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const frames = {
  none: {
    draw: (ctx, x, y, width, height) => {}, 
  },
  pastel: {
    draw: (ctx, x, y, width, height) => {
      const drawSticker = (x, y, type) => {
        switch(type) {
          case 'star':
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'heart':
            ctx.fillStyle = "#cc8084";
            ctx.beginPath();
            const heartSize = 22;
            ctx.moveTo(x, y + heartSize / 4);
            ctx.bezierCurveTo(x, y, x - heartSize / 2, y, x - heartSize / 2, y + heartSize / 4);
            ctx.bezierCurveTo(x - heartSize / 2, y + heartSize / 2, x, y + heartSize * 0.75, x, y + heartSize);
            ctx.bezierCurveTo(x, y + heartSize * 0.75, x + heartSize / 2, y + heartSize / 2, x + heartSize / 2, y + heartSize / 4);
            ctx.bezierCurveTo(x + heartSize / 2, y, x, y, x, y + heartSize / 4);
            ctx.fill();
            break;
          case 'flower':
            ctx.fillStyle = "#FF9BE4";
            for(let i = 0; i < 5; i++) {
              ctx.beginPath();
              const angle = (i * 2 * Math.PI) / 5;
              ctx.ellipse(
                x + Math.cos(angle) * 10,
                y + Math.sin(angle) * 10,
                8, 8, 0, 0, 2 * Math.PI
              );
              ctx.fill();
            }
            ctx.fillStyle = "#FFE4E1";
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'bow':
            ctx.fillStyle = "#f9cee7";
            ctx.beginPath();
            ctx.ellipse(x - 10, y, 10, 6, Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x + 10, y, 10, 6, -Math.PI / 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#e68bbe";
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            break;
        }
      };

      drawSticker(x + 11, y + 5, 'bow');
      drawSticker(x - 18, y + 95, 'heart');
      drawSticker(x + width - 160, y + 10, 'star');
      drawSticker(x + width - 1, y + 50, 'heart');
      drawSticker(x + 120, y + height - 20, 'heart');
      drawSticker(x + 20, y + height - 20, 'star');
      drawSticker(x + width - 125, y + height - 5, 'bow');
      drawSticker(x + width - 10, y + height - 45, 'heart');
    }
  },
  
  cute: {
    draw: (ctx, x, y, width, height) => {
      const drawStar = (centerX, centerY, size, color = "#FFD700") => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const point = i === 0 ? 'moveTo' : 'lineTo';
          ctx[point](
            centerX + size * Math.cos(angle),
            centerY + size * Math.sin(angle)
          );
        }
        ctx.closePath();
        ctx.fill();
      };

      const drawCloud = (centerX, centerY) => {
        ctx.fillStyle = "#87CEEB";
        const cloudParts = [
          { x: 0, y: 0, r: 14 },
          { x: -6, y: 2, r: 10 },
          { x: 6, y: 2, r: 10 },
        ];
        cloudParts.forEach(part => {
          ctx.beginPath();
          ctx.arc(centerX + part.x, centerY + part.y, part.r, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      drawStar(x + 150, y + 18, 15, "#FFD700");
      drawCloud(x + 20, y + 5);
      drawStar(x + width - 1, y + 45, 12, "#FF69B4");
      drawCloud(x + width - 80, y + 5);
      drawCloud(x + 150, y + height - 5);
      drawStar(x + 0, y + height - 65, 15, "#9370DB");
      drawCloud(x + width - 5, y + height - 85);
      drawStar(x + width - 120, y + height - 5, 12, "#40E0D0");
    }
  },
  
  bunny_cloud: {
    draw: (ctx, x, y, width, height) => {
      const drawBunny = (x, y, scale = 1) => {
        const size = 15 * scale;
        
        // Body
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.beginPath();
        ctx.ellipse(x - 8 * scale, y - 20 * scale, 5 * scale, 15 * scale, Math.PI / 6, 0, 2 * Math.PI);
        ctx.ellipse(x + 8 * scale, y - 20 * scale, 5 * scale, 15 * scale, -Math.PI / 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Inner ears (pink)
        ctx.fillStyle = "#FFC0CB";
        ctx.beginPath();
        ctx.ellipse(x - 8 * scale, y - 20 * scale, 3 * scale, 10 * scale, Math.PI / 6, 0, 2 * Math.PI);
        ctx.ellipse(x + 8 * scale, y - 20 * scale, 3 * scale, 10 * scale, -Math.PI / 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(x - 5 * scale, y - 2 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.arc(x + 5 * scale, y - 2 * scale, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = "#FF9999";
        ctx.beginPath();
        ctx.ellipse(x, y + 3 * scale, 3 * scale, 2 * scale, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Whiskers
        ctx.strokeStyle = "#DDD";
        ctx.lineWidth = scale;
        
        // Left whiskers
        ctx.beginPath();
        ctx.moveTo(x - 3 * scale, y + 3 * scale);
        ctx.lineTo(x - 15 * scale, y + 1 * scale);
        ctx.moveTo(x - 3 * scale, y + 3 * scale);
        ctx.lineTo(x - 15 * scale, y + 3 * scale);
        ctx.moveTo(x - 3 * scale, y + 3 * scale);
        ctx.lineTo(x - 15 * scale, y + 5 * scale);
        
        // Right whiskers
        ctx.moveTo(x + 3 * scale, y + 3 * scale);
        ctx.lineTo(x + 15 * scale, y + 1 * scale);
        ctx.moveTo(x + 3 * scale, y + 3 * scale);
        ctx.lineTo(x + 15 * scale, y + 3 * scale);
        ctx.moveTo(x + 3 * scale, y + 3 * scale);
        ctx.lineTo(x + 15 * scale, y + 5 * scale);
        
        ctx.stroke();
      };

      const drawCloud = (x, y, scale = 1) => {
        ctx.fillStyle = "#87CEEB";
        ctx.beginPath();
        ctx.arc(x, y, 14 * scale, 0, Math.PI * 2);
        ctx.arc(x - 6 * scale, y + 2 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.arc(x + 6 * scale, y + 2 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.arc(x + 16 * scale, y + 1 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.arc(x - 16 * scale, y + 1 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
      };

      // Top area
      drawBunny(x + 60, y + 15, 1);
      drawCloud(x + 100, y + 15, 0.9);
      
      drawBunny(x + 260, y + 20, 1);
      drawCloud(x + 350, y + 25, 1.1);
      
      // Middle area
      drawCloud(x + 40, y + height / 2 - 30, 0.8);
      drawBunny(x + 5, y + height / 2, 0.8);
      
      drawCloud(x + 400, y + height / 2 - 25, 0.9);
      
      
      // Bottom area
      drawCloud(x + 20, y + height - 30, 1.0);
      
     
      drawCloud(x + 270, y + height - 40, 0.85);
      drawBunny(x + 400, y + height - 35, 0.9);
      
      // Extra small bunnies and clouds in corners
      
      drawCloud(x + width - 20, y + 15, 0.6);
      drawBunny(x + width - 10, y + height - 200, 0.5);
      drawCloud(x + 20, y + height - 20, 0.6);
    }
  },

    teddy_honey: {  // 🧸🍯 สติกเกอร์ใหม่ (อัปเกรด)
      draw: (ctx, x, y, width, height) => {
        const drawBearSitting = (x, y, scale = 1) => {
          const size = 20 * scale;
  
          // 🧸 ตัวหมี
          ctx.fillStyle = "#FFADC6"; // น้ำตาลอ่อน
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
  
          // 🐻 หู
          ctx.beginPath();
          ctx.arc(x - 12 * scale, y - 12 * scale, 6 * scale, 0, Math.PI * 2);
          ctx.arc(x + 12 * scale, y - 12 * scale, 6 * scale, 0, Math.PI * 2);
          ctx.fill();
  
          // 👃🏻 จมูก
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.ellipse(x, y + 4 * scale, 4 * scale, 3 * scale, 0, 0, Math.PI * 2);
          ctx.fill();
  
          // 👀 ตา
          ctx.beginPath();
          ctx.arc(x - 6 * scale, y - 2 * scale, 3 * scale, 0, Math.PI * 2);
          ctx.arc(x + 6 * scale, y - 2 * scale, 3 * scale, 0, Math.PI * 2);
          ctx.fill();
  
          // 😊 ปาก
          ctx.strokeStyle = "#000";
          ctx.lineWidth = scale;
          ctx.beginPath();
          ctx.arc(x, y + 8 * scale, 5 * scale, 0, Math.PI, false);
          ctx.stroke();
  
          // 🐾 ขา (ให้ดูเหมือนนั่ง)
          ctx.fillStyle = "#FFC0CB";
          ctx.beginPath();
          ctx.arc(x - 10 * scale, y + 18 * scale, 8 * scale, 0, Math.PI * 2);
          ctx.arc(x + 10 * scale, y + 18 * scale, 8 * scale, 0, Math.PI * 2);
          ctx.fill();
        };
  
        const drawHoneyPot = (x, y, scale = 1) => {
          
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
          
        };
  
        // 🧸🍯 ตำแหน่งของตุ๊กตาหมีและขวดน้ำผึ้ง (จัดให้เหมาะกับรูป)
        drawBearSitting(x + 60, y + 40, 1);
        drawHoneyPot(x + 100, y + 50, 1);
        
        drawBearSitting(x + 260, y + 50, 1.2);
        drawHoneyPot(x + 350, y + 60, 1.2);
        
        // 🌟 หมีเล็ก ๆ และขวดน้ำผึ้งขนาดเล็ก
        drawBearSitting(x + 10, y + height - 50, 0.8);
        drawHoneyPot(x + 50, y + height - 40, 0.8);
  
        drawBearSitting(x + width - 50, y + height - 50, 0.9);
        drawHoneyPot(x + width - 10, y + height - 40, 0.9);
      }
    }
  };
  


const PhotoPreview = ({ capturedImages }) => {
  const stripCanvasRef = useRef(null);
  const navigate = useNavigate();
  const [stripColor, setStripColor] = useState("white");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [email, setEmail] = useState("");  
  const [status, setStatus] = useState(""); 
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false); // ✅ เพิ่ม state สำหรับคัดลอกลิงก์สำเร็จ
  
  const generatePhotoStrip = useCallback(() => {
    const canvas = stripCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const imgWidth = 400;  
    const imgHeight = 300; 
    const borderSize = 40;  
    const photoSpacing = 20;  
    const textHeight = 50;  
    const totalHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;

    canvas.width = imgWidth + borderSize * 2;
    canvas.height = totalHeight;

    ctx.fillStyle = stripColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let imagesLoaded = 0;
    capturedImages.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const yOffset = borderSize + (imgHeight + photoSpacing) * index;

        const imageRatio = img.width / img.height;
        const targetRatio = imgWidth / imgHeight;

        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;

        if (imageRatio > targetRatio) {
            sourceWidth = sourceHeight * targetRatio;
            sourceX = (img.width - sourceWidth) / 2;
        } else {
            sourceHeight = sourceWidth / targetRatio;
            sourceY = (img.height - sourceHeight) / 2;
        }

        ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight, 
            borderSize, yOffset, imgWidth, imgHeight      
        );

        if (frames[selectedFrame] && typeof frames[selectedFrame].draw === 'function') {
          frames[selectedFrame].draw(
              ctx,
              borderSize,
              yOffset,
              imgWidth,
              imgHeight
          );
        }
        
        imagesLoaded++;
        if (imagesLoaded === capturedImages.length) {
          const now = new Date();
          const timestamp = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }); // ❌ เอาการตั้งค่าเวลาออก
        
          ctx.fillStyle = "#000000";
          ctx.font = "bold 25px Phudu"; 
          
          ctx.textAlign = "center";
          
          // เปลี่ยนให้แสดงแค่ข้อความ "CAPTURING 2025"
          ctx.fillText("🧸 TEDDY Open HOUSE 🧸"+ timestamp, canvas.width / 2, totalHeight - borderSize * 1.2);
        
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.font = "15px Kanit";
          ctx.textAlign = "center";
          ctx.fillText(
            "© Capturing 2025",
            canvas.width / 2,
            totalHeight - borderSize * 0.6
          );
        }
        

        
      };
    });
  }, [capturedImages, stripColor, selectedFrame]);

  const createVideoFromPhotos = async () => {
    if (capturedImages.length !== 4) {
      setStatus("Need exactly 4 images to create video");
      return;
    }

    setIsCreatingVideo(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 300;

    try {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 2500000
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = 'photostrip.webm';
        a.click();
        URL.revokeObjectURL(videoUrl);
        setIsCreatingVideo(false);
      };

      // Load all images first
      const loadedImages = await Promise.all(
        capturedImages.map(
          src => new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          })
        )
      );

      mediaRecorder.start();

      let currentFrame = 0;
      const framesPerImage = 30; // 1 second per image at 30fps
      const totalFrames = framesPerImage * loadedImages.length;

      function animate() {
        const imageIndex = Math.floor(currentFrame / framesPerImage);
        
        // Clear canvas
        ctx.fillStyle = stripColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw current image
        ctx.drawImage(loadedImages[imageIndex], 0, 0, canvas.width, canvas.height);
        
        // Apply frame if selected
        if (frames[selectedFrame]?.draw) {
          frames[selectedFrame].draw(ctx, 0, 0, canvas.width, canvas.height);
        }

        // Add timestamp
        const now = new Date();
        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Capturing", canvas.width / 2, canvas.height - 20);

        currentFrame++;
        
        if (currentFrame < totalFrames) {
          requestAnimationFrame(animate);
        } else {
          mediaRecorder.stop();
        }
      }

      animate();
    } catch (error) {
      console.error('Error creating video:', error);
      setStatus('Error creating video. Please try again.');
      setIsCreatingVideo(false);
    }
  };

  useEffect(() => {
    if (capturedImages.length === 4) {
      setTimeout(() => {
        generatePhotoStrip();
      }, 100);
    }
  }, [capturedImages, stripColor, selectedFrame, generatePhotoStrip]);

  const downloadPhotoStrip = () => {
    const link = document.createElement("a");
    link.download = "Capturing-Photobooth.png";
    link.href = stripCanvasRef.current.toDataURL("image/png");
    link.click();
    
  };

  // 📌 เพิ่มฟังก์ชันสำหรับแชร์ไปยัง Instagram Story
  const shareToInstagramStory = async () => {
  if (!stripCanvasRef.current) return;

  // แปลง Canvas เป็น Base64 (JPEG Format)
  const imageData = stripCanvasRef.current.toDataURL("image/jpeg");

  try {
    const blob = await fetch(imageData).then(res => res.blob()); // แปลงเป็น Blob
    const data = new FormData();
    data.append("file", blob, "story.jpg"); // ตั้งชื่อไฟล์

    // ใช้ Instagram Deep Link สำหรับแชร์ไปที่ IG Story
    const uri = `instagram-stories://share?source_application=com.yourapp`;
    
    const anchor = document.createElement("a");
    anchor.href = uri;
    anchor.click();
  } catch (error) {
    console.error("Error sharing to Instagram Story:", error);
  }
};


  const copyPageLink = () => {
    const pageUrl = window.location.href; // ดึง URL ปัจจุบัน

    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500); // แสดงข้อความสำเร็จ 2 วินาที
    });
  };

  const sendPhotoStripToEmail = async () => {
    // Clear previous status
    setStatus("");
    
    // Comprehensive email validation
    const validateEmail = (email) => {
      // Basic format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return false;
      
      // Common typos and issues
      if (email.includes('..') || email.endsWith('.') || email.startsWith('.')) return false;
      if (email.includes('@@') || email.startsWith('@')) return false;
      
      // Length checks
      if (email.length < 5 || email.length > 254) return false;
      
      // Domain part checks
      const [localPart, domain] = email.split('@');
      if (!domain || domain.length < 3) return false;
      if (!domain.includes('.')) return false;
      
      // Local part length check
      if (localPart.length > 64) return false;
      
      // TLD validation (must be at least 2 characters)
      const tld = domain.split('.').pop();
      if (!tld || tld.length < 2) return false;
      
      return true;
    };
    // List of commonly mistyped domains and their corrections
    const commonMisspellings = {
      'gmail.co': 'gmail.com',
      'gmail.cm': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'yahoo.co': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'hotmail.co': 'hotmail.com',
      'hotmial.com': 'hotmail.com',
      'outloo.com': 'outlook.com',
      'outlok.com': 'outlook.com'
    };
    // Check and suggest corrections for common email misspellings
    const checkForTypos = (email) => {
      const [localPart, domain] = email.split('@');
      if (commonMisspellings[domain]) {
        return {
          hasTypo: true,
          suggestion: `${localPart}@${commonMisspellings[domain]}`
        };
      }
      return { hasTypo: false };
    };
  
    if (!email) {
      setStatus("Please enter an email address.");
      return;
    }
  
    // Check for common typos
    const typoCheck = checkForTypos(email);
    if (typoCheck.hasTypo) {
      if (confirm(`Did you mean ${typoCheck.suggestion}?`)) {
        setEmail(typoCheck.suggestion);
        // Continue with the corrected email
      } else {
        // User declined correction, continue with validation
      }
    }
  
    if (!validateEmail(email)) {
      setStatus("Please enter a valid email address. Example: name@example.com");
      return;
    }
  
    // Blocked domains validation
    const blockedDomains = [
      'mymail.lausd.net',
      'lausd.net',
      'domain@undefined',
      'undefined',
      '@undefined'
    ];
    const domain = email.split('@')[1];
    if (blockedDomains.includes(domain) || domain.includes('undefined')) {
      setStatus("This email domain is not supported. Please use a different email address.");
      return;
    }
  
    try {
      setStatus("Sending email...");
      
      // Add a delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send-photo-strip`, {
        recipientEmail: email.trim(), // Trim to remove any accidental spaces
        imageData: stripCanvasRef.current.toDataURL("image/jpeg", 0.5)
      });
  
      if (response.data.success) {
        setStatus("Photo Strip sent successfully! Please check your inbox (and spam folder).");
        setEmail("");
      } else {
        setStatus(`Failed to send: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Network Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // More user-friendly error messages
      if (error.response?.status === 400) {
        setStatus(`Error: ${error.response.data.message || "Invalid email address"}`);
      } else if (error.message.includes("Network Error")) {
        setStatus("Network connection error. Please check your internet connection and try again.");
      } else {
        setStatus(`Error: ${error.response?.data?.message || "Failed to send. Please try again later."}`);
      }
    }
  };

  return (
    <div className="photo-preview">
      <h2>Photo Strip Preview</h2>

      <div className="control-section">
        <h3>Customize your photo strip</h3>

        <p className="section-title">Frame Color</p>
        <div className="color-options">
          <button className="color-btn white" onClick={() => setStripColor("white")}>White</button>
          <button className="color-btn black" onClick={() => setStripColor("black")}>Black</button>
          <button className="color-btn pink" onClick={() => setStripColor("#f6d5da")}>Pink</button>
          <button className="color-btn green" onClick={() => setStripColor("#dde6d5")}>Green</button>
          <button className="color-btn blue" onClick={() => setStripColor("#adc3e5")}>Blue</button>
          <button className="color-btn yellow" onClick={() => setStripColor("#FFF2CC")}>Yellow</button>
          <button className="color-btn purple" onClick={() => setStripColor("#dbcfff")}>Purple</button>
        </div>


        <p className="section-title">Stickers</p>
        <div className="frame-options">
          <button onClick={() => setSelectedFrame("none")}>No Stickers</button>
          <button onClick={() => setSelectedFrame("pastel")}>Girlypop Stickers</button>
          <button onClick={() => setSelectedFrame("cute")}>Cute Stickers</button>
          <button onClick={() => setSelectedFrame("bunny_cloud")}>Bunny Stickers</button>
          <button onClick={() => setSelectedFrame("teddy_honey")}>Teddy</button> {/* 🧸🍯 ปุ่มใหม่ */}
        </div>
      </div>

      <canvas ref={stripCanvasRef} className="photo-strip" />
      
      <div className="control-section">
        <div className="action-buttons">
        <button onClick={copyPageLink} className="ig-sharess">
            <BsCopy size={20} style={{ marginRight: '0px' }} />
            {copySuccess ? " คัดลอกแล้ว!" : ""}
        </button>
        <button onClick={downloadPhotoStrip} className="ig-sharess">
            <MdOutlineFileDownload size={20} style={{ marginRight: '0px' }} />
        </button>
        
        <button onClick={shareToInstagramStory} className="ig-sharess">
            <Instagram size={20} style={{ marginRight: '0px' }} /> For IG Story
        </button>

        </div>

       
         <button onClick={() => navigate("/photobooth")} className="play-again-btn">
            <GrPowerReset size={20} style={{ marginRight: '5px' }} /> PLAY AGAIN
        </button>
        
        </div>
      </div>
   
  );
};

export default PhotoPreview;