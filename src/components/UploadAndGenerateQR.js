import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const UploadAndGenerateQR = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const API_KEY = "3bf81bea81669b4855c970d474738974"; // ใส่ API Key ของ ImgBB

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setImageUrl(data.data.url);
    setUploading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>อัปโหลดรูปภาพ</h2>
      <input type="file" onChange={handleUpload} accept="image/*" />
      {uploading && <p>กำลังอัปโหลด...</p>}
      {imageUrl && (
        <>
          <p>QR Code สำหรับดาวน์โหลดรูปของคุณ:</p>
          <QRCodeCanvas value={imageUrl} size={200} />
          <p>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              ดาวน์โหลดรูปภาพ
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default UploadAndGenerateQR;
