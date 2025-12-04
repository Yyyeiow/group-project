import React, { useState } from "react";

const MainContentInput = ({ content, setContent }) => {
  const [text, setText] = useState("");
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setContent([...content, { type: "image", value: imageUrl }]);
    }
  };

  const handleAddText = () => {
    if (text.trim() !== "") {
      setContent([...content, { type: "text", value: text }]);
      setText("");
    }
  };

  return (
    <div className="form-group">
      <label>본문</label>

      <textarea
        rows={4}
        placeholder="본문 작성 (글+이미지 섞기)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
        <button type="button" onClick={handleAddText} className="form-button">
          글 추가
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleAddImage}
          className="form-button"
          style={{ padding: "0 10px" }}
        />
      </div>

      {/* 미리보기 */}
      <div style={{ marginTop: "10px" }}>
        {content.map((item, idx) =>
          item.type === "text" ? (
            <p key={idx}>{item.value}</p>
          ) : (
            <img
              key={idx}
              src={item.value}
              alt={`본문 이미지 ${idx}`}
              style={{ maxWidth: "100%", margin: "10px 0" }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MainContentInput;
