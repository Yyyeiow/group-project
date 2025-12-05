import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import { getMyInfo, getPostsByUser } from "../api/api";

function MyPage() {
const navigate = useNavigate();
const [layout, setLayout] = useState("list");
const [posts, setPosts] = useState([]);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadMyPosts();
}, []);

const loadMyPosts = async () => {
  try {
    const userData = await getMyInfo();
    setUser(userData);
    const postsData = await getPostsByUser(userData.id);
    setPosts(postsData.content || []);
    setLoading(false);
  } catch (error) {
    console.error("내 게시물 로딩 실패:", error);
    alert("로그인이 필요합니다!");
    navigate("/login");
  }
};

if (loading) {
  return <div className="mypage-container">로딩 중...</div>;
}

return ( <div className="mypage-container">
{/* 헤더 */} <header className="mypage-header"> <div className="header-left"></div>


    <div className="header-right-all">
      <div className="header-btn-group">
        <button className="nav-btn">📅 Calendar</button>
        <button className="nav-btn">❤️ Hearts</button>
      </div>

      <div className="view-switch">
        <button
          className={layout === "grid" ? "active" : ""}
          onClick={() => setLayout("grid")}
        >
          ▦
        </button>
        <button
          className={layout === "list" ? "active" : ""}
          onClick={() => setLayout("list")}
        >
          ≡
        </button>
      </div>
    </div>
  </header>

  {/* 피드 */}
  <main className={layout === "grid" ? "feed-grid" : "feed-list"}>
    {posts.length === 0 ? (
      <div className="no-posts">아직 작성한 게시물이 없습니다.</div>
    ) : (
      posts.map((post) => (
        <div key={post.id} className="post">
          {layout === "list" && (
            <div className="post-date">
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </div>
          )}

          <div className="post-title">
            ▶ {post.artist} - {post.title}
          </div>

          {/* 이미지 표시 */}
          <div className="post-images">
            {post.imageUrls && post.imageUrls.length > 0 ? (
              (layout === "grid" ? post.imageUrls.slice(0, 1) : post.imageUrls)
                .map((img, i) => (
                  <div key={i} className="post-img-box">
                    <img src={img} alt={`게시물 이미지 ${i + 1}`} />
                  </div>
                ))
            ) : post.albumImageUrl ? (
              <div className="post-img-box">
                <img src={post.albumImageUrl} alt="앨범 커버" />
              </div>
            ) : (
              <div className="post-img-box">
                <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>이미지 없음</div>
              </div>
            )}
          </div>

          {layout === "list" && (
            <div className="post-content">{post.content}</div>
          )}
        </div>
      ))
    )}
  </main>
</div>

);
}

export default MyPage;
