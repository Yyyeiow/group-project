import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./SearchResultPage.css";
import { searchPosts } from "../api/api";
import PostCard from "../components/HomepageCP/PostCard";
import Pagination from "../components/HomepageCP/Pagination";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState(new Set());

  useEffect(() => {
    if (keyword) {
      loadSearchResults();
    }
  }, [keyword, currentPage]);

  const loadSearchResults = async () => {
    setLoading(true);
    try {
      const data = await searchPosts(keyword, currentPage - 1, 9);
      
      const formattedPosts = data.content.map(post => ({
        type: 'post',
        id: post.id,
        saved: false,
        description: post.description,
        artist: post.artist,
        title: post.title,
        albumImageUrl: post.albumImageUrl,
        representImageUrl: post.representImageUrl,
        overflow: post.title && post.title.length > 20
      }));

      setPosts(formattedPosts);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("검색 실패:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (postId, isLiked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, saved: isLiked } : post
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="search-result-loading">검색 중...</div>;
  }

  return (
    <div className="search-result-page">
      <div className="search-result-header">
        <h1>검색 결과</h1>
        <p className="search-keyword">"{keyword}" 검색 결과: {posts.length}개</p>
      </div>

      {posts.length === 0 ? (
        <div className="no-results">
          <p>검색 결과가 없습니다.</p>
          <p>다른 키워드로 검색해보세요.</p>
        </div>
      ) : (
        <>
          <div className="search-result-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isSaved={post.saved}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
