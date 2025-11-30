import React from "react";
import "./HomepageCPcss/Confetti.css";

const Confetti = ({ count = 100, size = 50, duration = 1 }) => {
   return (
    <div className="confetti-container">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;  // 좌우 랜덤
        const delay = Math.random() * 1.5; // 시작 시간 랜덤
        return (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${left}vw`,
              fontSize: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            {Math.random() > 0.5 ? "🎧" : "🎵"}
          </span>
        );
      })}
    </div>
  );
};

export default Confetti;
