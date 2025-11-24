import React, { useRef } from "react";
import "./WritepageCPcss/RichTextEditor.css";

const RichTextEditor = ({ content, setContent, images, setImages, representImage, setRepresentImage }) => {
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    e.stopPropagation();
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    if (!representImage && newImages.length > 0) setRepresentImage(newImages[0].url);
  };

  const handlePaste = (e) => {
    e.stopPropagation();

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const url = URL.createObjectURL(blob);
        setImages((prev) => [...prev, { file: blob, url }]);
        if (!representImage) setRepresentImage(url);
      }
    }
  };

  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    if (representImage === images[idx].url) setRepresentImage(updated[0]?.url || null);
    setImages(updated);
  };

  const setAsRepresent = (url) => setRepresentImage(url);

  return (
    <div className="richtext-editor">
      
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />

      <div className="image-preview-wrapper">
        {images.map((img, idx) => (
          <div key={idx} className="image-preview-box">
            <img src={img.url} alt="본문 이미지" className="image-preview" />
            <button className="remove-btn" onClick={() => removeImage(idx)}>삭제</button>
            <button
              type= "button"
              className={`represent-btn ${representImage === img.url ? "active" : ""}`}
              onClick={() => setAsRepresent(img.url)}
            >
              대표
            </button>
          </div>
        ))}
      </div>

      <textarea
        className="editor-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onPaste={handlePaste}
        placeholder="본문 작성 (글 + 이미지 가능)"
      ></textarea>
       <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>
  이미지 파일 업로드
</button>
    </div>
  );
};

export default RichTextEditor;
