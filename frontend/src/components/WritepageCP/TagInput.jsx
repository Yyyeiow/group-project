import React, { useState } from "react";
import "./WritepageCPcss/TagInput.css";

const TagInput = ({ tags, setTags }) => {
  const [inputTag, setInputTag] = useState("");

  const handleTagKeyPress = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (inputTag.trim() !== "") {
        const formattedTag = inputTag.startsWith("#") ? inputTag : `#${inputTag}`;
        setTags([...tags, formattedTag]);
        setInputTag("");
      }
    }
  };

  return (
    <div className="form-group">
      <label>태그</label>
      <input
        id="tag-input"
        type="text"
        placeholder="#추억 #감성"
        value={inputTag}
        onChange={(e) => setInputTag(e.target.value)}
        onKeyDown={handleTagKeyPress}
      />
      <div className="tag-list">
        {tags.map((tag, idx) => (
          <span key={idx} className="tag-item">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
