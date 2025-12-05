import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동
import "./writepage.css";

import MusicSelector from "../components/WritepageCP/MusicSelector";
import RichTextEditor from "../components/WritepageCP/RichTextEditor";
import TagInput from "../components/WritePageCP/TagInput";
import MemoryLineInput from "../components/WritePageCP/MemoryLineInput";
import SubmitButton from "../components/WritepageCP/SubmitButton";
import { uploadImages, createPost } from "../api/api"; // 백엔드 API 가져오기

const WritePage = () => {
  // 📝 State (데이터 저장소)
  const [selectedSong, setSelectedSong] = useState(null); // 선택된 노래
  const [memoryLine, setMemoryLine] = useState(""); // 한 줄 요약 (description)
  const [content, setContent] = useState(""); // 본문 내용
  const [images, setImages] = useState([]); // 업로드한 이미지들
  const [representImage, setRepresentImage] = useState(null); // 대표 이미지
  const [tags, setTags] = useState([]); // 태그들
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중인지
  const navigate = useNavigate();

  /**
   * 🚀 게시물 제출 함수 (백엔드 전송)
   * 
   * 1단계: 이미지를 먼저 업로드해서 URL을 받음
   * 2단계: 게시물 데이터와 함께 백엔드에 전송
   * 3단계: 성공하면 홈페이지로 이동
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ 필수 항목 체크
    if (!selectedSong) {
      alert("노래를 선택해주세요!");
      return;
    }

    if (!memoryLine.trim()) {
      alert("한 줄 추억을 입력해주세요!");
      return;
    }

    if (!representImage) {
      alert("대표 이미지를 선택해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2️⃣ 이미지 업로드 (File 객체만 추출)
      console.log("이미지 업로드 시작...");
      console.log("images:", images);
      console.log("representImage:", representImage);
      
      const imageFiles = images.map(img => img.file); // {file, url} 중에서 file만
      const uploadedUrls = await uploadImages(imageFiles);
      console.log("업로드된 이미지 URLs:", uploadedUrls);

      // 3️⃣ 대표 이미지 URL 찾기 (representImage는 URL 문자열!)
      const representImageIndex = images.findIndex(img => img.url === representImage);
      const representImageUrl = uploadedUrls[representImageIndex];

      console.log("대표 이미지 인덱스:", representImageIndex);
      console.log("대표 이미지 URL:", representImageUrl);

      // 4️⃣ 백엔드에 보낼 데이터 구조
      const postData = {
        description: memoryLine, // 한 줄 요약 (카드에 표시될 내용!)
        content: content, // 본문 내용 (전체)
        spotifyTrackId: selectedSong.id, // Spotify 트랙 ID
        title: selectedSong.title, // 노래 제목
        artist: selectedSong.artist, // 아티스트 이름
        albumImageUrl: selectedSong.albumArtUrl, // 앨범 커버
        representImageUrl: representImageUrl, // 대표 이미지 URL
        imageUrls: uploadedUrls, // 모든 이미지 URLs (배열)
        tags: tags // 배열 그대로 전송! ["힙합", "신나는"]
      };

      console.log("백엔드에 전송할 데이터:", postData);

      // 5️⃣ 게시물 생성 API 호출
      console.log("현재 토큰:", localStorage.getItem('token'));
      const result = await createPost(postData);
      console.log("게시물 생성 성공:", result);

      // 6️⃣ 성공 메시지 & 홈페이지로 이동
      alert("게시물이 등록되었습니다!");
      navigate("/"); // 홈페이지로 이동

    } catch (error) {
      console.error("게시물 작성 실패:", error);
      alert("게시물 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="main-content">
      <MusicSelector selectedSong={selectedSong} setSelectedSong={setSelectedSong} />
      <MemoryLineInput memoryLine={memoryLine} setMemoryLine={setMemoryLine} />
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

      {/* 제출 버튼 - 제출 중일 때 비활성화 */}
      <button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          padding: '10px 20px',
          backgroundColor: isSubmitting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? "업로드 중..." : "게시물 등록"}
      </button>
    </main>
  );
};

export default WritePage;
