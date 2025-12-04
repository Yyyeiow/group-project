import React, { useState } from "react";
import "./writepage.css";

import MusicSelector from "../components/WritepageCP/MusicSelector";
import RichTextEditor from "../components/WritepageCP/RichTextEditor";
import TagInput from "../components/WritePageCP/TagInput";
import MemoryLineInput from "../components/WritePageCP/MemoryLineInput";
import SubmitButton from "../components/WritepageCP/SubmitButton";

const WritePage = () => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [content, setContent] = useState(""); 
  const [images, setImages] = useState([]);
  const [representImage, setRepresentImage] = useState(null);
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      song: selectedSong,
      content,
      images: images.map((img) => img.url),
      representImage,
      tags,
    };

    console.log("제출 데이터:", newPost);
    alert("새 게시물이 등록되었습니다!");
  };

  return (
    <main className="main-content">
      <MusicSelector selectedSong={selectedSong} setSelectedSong={setSelectedSong} />
      <MemoryLineInput />
      <form onSubmit={handleSubmit} className="write-form-container">
       

        <RichTextEditor
          content={content}
          setContent={setContent}
          images={images}
          setImages={setImages}
          representImage={representImage}
          setRepresentImage={setRepresentImage}
        />

        
      </form>
      <TagInput tags={tags} setTags={setTags} />

      <SubmitButton/>
    </main>
  );
};

export default WritePage;
