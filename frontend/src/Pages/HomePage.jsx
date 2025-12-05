
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동
import TagsSection from "../components/HomepageCP/TagsSection";
import PostCard from "../components/HomepageCP/PostCard";
import Pagination from "../components/HomepageCP/Pagination";
import Popup from "../components/HomepageCP/Popup";
import { getPosts } from "../api/api"; // 백엔드 API 가져오기
import "./HomePage.css";

function HomePage() {
  // 📝 State (데이터 저장소)
  const [gridItems, setGridItems] = useState([]); // 게시물 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (1부터 시작)
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [isLoading, setIsLoading] = useState(false); // 로딩 중인지
  const [isFixed, setIsFixed] = useState(true); 
  const navigate = useNavigate();
  const itemsPerPage = 9;

  /**
   * 📥 백엔드에서 게시물 목록 가져오기
   * 
   * useEffect는 React에서 "페이지가 로드될 때" 또는 "특정 값이 바뀔 때" 
   * 자동으로 실행되는 코드 블록입니다!
   */
  useEffect(() => {
    loadPosts();
  }, [currentPage]); // currentPage가 바뀔 때마다 실행!

  /**
   * 🔄 게시물 불러오기 함수
   */
  const loadPosts = async () => {
    setIsLoading(true);

    try {
      // 백엔드에 게시물 요청 (페이지는 0부터 시작!)
      const data = await getPosts(currentPage - 1, itemsPerPage);
      
      console.log("받은 게시물 데이터:", data);

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const formattedPosts = data.content.map(post => ({
        type: 'post',
        id: post.id,
        saved: false, // 저장 기능은 나중에 추가
        description: post.description, // 한 줄 요약
        artist: post.artist, // 아티스트 이름 (백엔드는 artist로 반환!)
        title: post.title, // 노래 제목 (백엔드는 title로 반환!)
        albumImageUrl: post.albumImageUrl, // 앨범 커버
        representImageUrl: post.representImageUrl, // 대표 이미지
        overflow: post.title && post.title.length > 20 // 제목이 길면 overflow (null 체크)
      }));

      setGridItems(formattedPosts);
      setTotalPages(data.totalPages || 1);

    } catch (error) {
      console.error("게시물 로딩 에러:", error);
      // 에러 발생 시 빈 배열 표시
      setGridItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToggle = (postId) => {
    setGridItems((prevItems) =>
      prevItems.map((item) =>
        item.id === postId ? { ...item, saved: !item.saved } : item
      )
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      const button = document.querySelector(".write-btn");
      if (!footer || !button) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;


      if (footerRect.top < windowHeight - 80) {
        setIsFixed(false); 
      } else {
        setIsFixed(true); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⚠️ 페이지네이션은 백엔드에서 처리하므로 slice 불필요!
  // gridItems는 이미 백엔드에서 페이징 처리된 9개 데이터
  const currentItems = gridItems;

  return (
    
    <main className="main-content">
      <TagsSection />
      <Popup /> 
      
      {/* 로딩 중일 때 표시 */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>게시물을 불러오는 중...</p>
        </div>
      )}

      {/* 게시물이 없을 때 표시 */}
      {!isLoading && gridItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>게시물이 없습니다. 첫 번째 게시물을 작성해보세요!</p>
        </div>
      )}

      {/* 게시물 목록 */}
      {!isLoading && gridItems.length > 0 && (
        <>
          <div className="grid-container">
            {currentItems.map((item) =>
              item.type === "post" ? (
                <PostCard
                  key={item.id}
                  post={item}
                  onSaveToggle={handleSaveToggle}
                />
              ) : null
            )}
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      <button
        className={`write-btn ${isFixed ? "fixed" : "absolute"}`}
        onClick={() => navigate("/write")}
      >
    <svg height="1em" viewBox="0 0 512 512"> <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path> </svg>
      </button>
    </main>
  );
}

export default HomePage;