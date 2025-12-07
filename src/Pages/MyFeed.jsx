import React, { useState } from "react";
import "./MyFeed.css";

function MyFeed() {
  const [layout, setLayout] = useState("list");
  const [playing, setPlaying] = useState({});

  const togglePlay = (id) => {
    setPlaying((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const posts = [
    {
      id: 1,
      date: "2025.01.12",
      artist: "aespa",
      title: "Whiplash",
      albumCover: "https://i.scdn.co/image/ab67616d0000b273b2cb6f",
      hoverCover: "https://i.scdn.co/image/ab67616d0000b273ffae1d",
      content: "내용 예시 ...",
    },
    {
      id: 2,
      date: "2025.01.08",
      artist: "아일릿",
      title: "Magnetic",
      albumCover: "https://i.scdn.co/image/ab67616d0000b273aa2222",
      hoverCover: "https://i.scdn.co/image/ab67616d0000b273bb3333",
      content: "내용 예시 2...",
    },
  ];

  return (
    <div className="myfeed-container">
      <header className="myfeed-header">
        <h2 className="feed-title">한 줄 소개 예시</h2>

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
      </header>

      <main className={layout === "grid" ? "feed-grid" : "feed-list"}>
        {posts.map((post) => (
          <div key={post.id} className="post">
            {layout === "list" && (
              <>
                <div className="post-date">{post.date}</div>

                <div className="post-title { font-size: 17px; font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 6px; }">
                  <span
                    className={`post-play-icon { position: relative; left: 0; } ${playing[post.id] ? "playing" : ""}`}
                    onClick={() => togglePlay(post.id)}
                  >
                    {playing[post.id] ? "ll" : "▶"}
                  </span>
                  {post.artist} - {post.title}
                </div>
              </>
            )}

            <div className="post-images {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: nowrap; 
}">
              {layout === "grid" ? (
                <div
                  className="post-img-box api-img"
                  style={{
                    backgroundImage: `url(${post.albumCover})`,
                    "--hover-img": `url(${post.hoverCover})`,
                  }}
                ></div>
              ) : (
                <>
                  <div className="post-img-box empty-box"></div>
                  <div className="post-img-box empty-box"></div>
                  <div className="post-img-box empty-box"></div>
                </>
              )}
            </div>

            {layout === "list" && <div className="post-content">{post.content}</div>}
          </div>
        ))}
      </main>
    </div>
  );
}

export default MyFeed;


