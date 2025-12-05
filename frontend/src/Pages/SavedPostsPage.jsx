import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedPostsPage.css";
import { getLikedPosts } from "../api/api";
import PostCard from "../components/HomepageCP/PostCard";

export default function SavedPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState(new Set());

  useEffect(() => {
    loadLikedPosts();
  }, []);

  const loadLikedPosts = async () => {
    try {
      const likedPosts = await getLikedPosts();
      setPosts(likedPosts);
      // 모든 게시물 ID를 savedPosts에 추가
      setSavedPosts(new Set(likedPosts.map(post => post.id)));
      setLoading(false);
    } catch (error) {
      console.error("좋아요한 게시물 로딩 실패:", error);
      alert("로그인이 필요합니다!");
      navigate("/login");
    }
  };

  const handleSaveToggle = (postId, isLiked) => {
    if (isLiked) {
      setSavedPosts(prev => new Set([...prev, postId]));
    } else {
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      // 좋아요 취소된 게시물은 목록에서 제거
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  if (loading) {
    return <div className="saved-posts-loading">로딩 중...</div>;
  }

  return (
    <div className="saved-posts-page">
      <div className="saved-posts-header">
        <h1>💾 저장한 글 모아보기</h1>
        <p className="saved-posts-count">총 {posts.length}개의 게시물</p>
      </div>

      {posts.length === 0 ? (
        <div className="no-saved-posts">
          <p>아직 저장한 게시물이 없습니다.</p>
          <button onClick={() => navigate("/")}>게시물 둘러보기</button>
        </div>
      ) : (
        <div className="saved-posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isSaved={savedPosts.has(post.id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
