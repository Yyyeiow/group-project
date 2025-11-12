import React, { useState } from "react";
import "./MyFeed.css";

function MyFeed() {
  const [layout, setLayout] = useState("grid");

  const posts = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    img: "", // 빈 이미지
  }));

  return (
    <div className="myfeed-container">
      <header className="myfeed-header">
        <div className="header-left">
          {/* 나중에 로고 자리 */}
        </div>

        <div className="header-right">
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

      <main
        id="feed"
        className={layout === "grid" ? "feed-grid" : "feed-list"}
      >
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-image"></div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default MyFeed;
