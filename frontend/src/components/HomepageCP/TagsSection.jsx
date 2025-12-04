import React, { useEffect, useState } from "react";
import "./HomepageCPcss/TagsSection.css";
const TagsSection = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // 나중에 실제 API 연동
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch(() =>
        setTags(["#힙합", "#발라드", "#감성", "#드라이브", "#새벽감성"])
      );
  }, []);

  return (
    <div className="tags-section">
      <div className="tags-wrapper">
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="tag"
              onClick={() => alert(`${tag} 태그 검색`)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsSection;
