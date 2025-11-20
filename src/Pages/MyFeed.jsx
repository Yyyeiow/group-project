import React, { useState } from "react";
import "./MyFeed.css";

function MyFeed() {
const [layout, setLayout] = useState("list");

const posts = [
{
id: 1,
date: "2025. 01. 12",
artist: "aespa",
title: "Supernova",
images: ["", "", ""],
content: "내용 예시...",
},
{
id: 2,
date: "2025. 01. 08",
artist: "아일릿",
title: "Magnetic",
images: ["", ""],
content: "내용예시2 ..",
},
];

return ( <div className="myfeed-container">
{/* 헤더 */} <header className="myfeed-header"> <div className="header-left"></div>


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
    {posts.map((post) => (
      <div key={post.id} className="post">
        {layout === "list" && (
          <div className="post-date">{post.date}</div>
        )}

        <div className="post-title">
          ▶ {post.artist} - {post.title}
        </div>

        {/* ▦-1 */}
        <div className="post-images">
          {(layout === "grid" ? post.images.slice(0, 1) : post.images)
            .map((img, i) => (
              <div key={i} className="post-img-box"></div>
            ))}
        </div>

        {layout === "list" && (
          <div className="post-content">{post.content}</div>
        )}
      </div>
    ))}
  </main>
</div>

);
}

export default MyFeed;
