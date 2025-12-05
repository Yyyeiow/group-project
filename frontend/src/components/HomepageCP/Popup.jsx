import React, { useState, useEffect } from "react";
import "./HomepageCPcss/Popup.css";
import Confetti from "./Confetti";

import popup1 from "../../assets/popup1.jpg";
import popup2 from "../../assets/popup2.jpg";
import popup3 from "../../assets/popup3.jpg";
import popup4 from "../../assets/popup4.jpg";
import popup5 from "../../assets/popup5.jpg";
import popup6 from "../../assets/popup6.jpg";
import popup7 from "../../assets/popup7.jpg";
import popup8 from "../../assets/popup8.jpg";
import popup9 from "../../assets/popup9.jpg";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const funnyImages = [popup1, popup2, popup3, popup4, popup5, popup6, popup7, popup8, popup9];
    const randomIndex = Math.floor(Math.random() * funnyImages.length);
    setImageUrl(funnyImages[randomIndex]);
  }, []);

  const handleClose = () => {
    // 팝업 먼저 사라짐
    setIsOpen(false);
    // Confetti 잠깐 나타나게
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000); // 4초 후 Confetti 제거
  };

  return (
    <>
      {isOpen && imageUrl && (
        <div className="modal-backdrop">
          <div className="modal">
            <img src={imageUrl} alt="웃긴 사진" className="funny-image" />
            <button className="close-btn" onClick={handleClose}>
              X
            </button>
          </div>
        </div>
      )}
      {showConfetti && <Confetti  />}
    </>
  );
}
