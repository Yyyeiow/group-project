
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동
import TagsSection from "../components/HomepageCP/TagsSection";
import PostCard from "../components/HomepageCP/PostCard";
import Pagination from "../components/HomepageCP/Pagination";
import "./HomePage.css";

const initialGridItems = [
  { type: 'post', id: 1, saved: false, description: "새벽 감성이 물씬 풍기는 노래", artist: "아이유", title: "밤편지", overflow: false },
  { type: 'post', id: 2, saved: false, description: "드라이브하면서 듣기 딱 좋은 곡", artist: "너드커넥션", title: "구름 위를 걷는 기분이에요 정말 좋아요", overflow: true },
  { type: 'post', id: 3, saved: false, description: "비 오는 날 듣고 싶은 노래", artist: "에픽하이", title: "우산", overflow: false },
  { type: 'post', id: 4, saved: false, description: "운동할 때 텐션 올리기 좋음", artist: "BTS", title: "불타오르네", overflow: false },
  { type: 'post', id: 5, saved: false, description: "카페에서 작업할 때 최고", artist: "이적", title: "다행이다", overflow: false },
  { type: 'post', id: 6, saved: false, description: "힘들 때 위로가 되는 노래", artist: "10cm", title: "폰서트", overflow: false },
  { type: 'post', id: 7, saved: false, description: "새벽 감성이 물씬 풍기는 노래", artist: "아이유", title: "밤편지", overflow: false },
  { type: 'post', id: 8, saved: false, description: "드라이브하면서 듣기 딱 좋은 곡", artist: "너드커넥션", title: "구름 위를 걷는 기분이에요 정말 좋아요", overflow: true },
  { type: 'post', id: 9, saved: false, description: "비 오는 날 듣고 싶은 노래", artist: "에픽하이", title: "우산", overflow: false },
  { type: 'post', id: 10, saved: false, description: "운동할 때 텐션 올리기 좋음", artist: "BTS", title: "불타오르네", overflow: false },
  { type: 'post', id: 11, saved: false, description: "카페에서 작업할 때 최고", artist: "이적", title: "다행이다", overflow: false },
  { type: 'post', id: 12, saved: false, description: "힘들 때 위로가 되는 노래", artist: "10cm", title: "폰서트", overflow: false },
  { type: 'post', id: 13, saved: false, description: "새벽 감성이 물씬 풍기는 노래", artist: "아이유", title: "밤편지", overflow: false },
  { type: 'post', id: 14, saved: false, description: "드라이브하면서 듣기 딱 좋은 곡", artist: "너드커넥션", title: "구름 위를 걷는 기분이에요 정말 좋아요", overflow: true },
  { type: 'post', id: 15, saved: false, description: "비 오는 날 듣고 싶은 노래", artist: "에픽하이", title: "우산", overflow: false },
  { type: 'post', id: 16, saved: false, description: "운동할 때 텐션 올리기 좋음", artist: "BTS", title: "불타오르네", overflow: false },
  { type: 'post', id: 17, saved: false, description: "카페에서 작업할 때 최고", artist: "이적", title: "다행이다", overflow: false },
  { type: 'post', id: 18, saved: false, description: "힘들 때 위로가 되는 노래", artist: "10cm", title: "폰서트", overflow: false }
];

function HomePage() {
  const [gridItems, setGridItems] = useState(initialGridItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFixed, setIsFixed] = useState(true); 
  const navigate = useNavigate();
  const itemsPerPage = 9;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = gridItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(gridItems.length / itemsPerPage);

  return (
    <main className="main-content">
      <TagsSection />

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