import React, { useState } from "react";
import "./WritepageCPcss/MusicSelector.css";

const MusicSelector = ({ selectedSong, setSelectedSong }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleMusicSearch = async () => {
    
    if (!searchQuery) return;
    setIsSearching(true);

    try {
      // 여기에 실제 API 호출 가능
      // const res = await fetch(`/api/music?query=${searchQuery}`);
      // const data = await res.json();

      // 임시 mock
      let mockResults = [];
      if (searchQuery.includes("아이유")) {
        mockResults = [
          { id: "m1", artist: "아이유", title: "밤편지", albumArtUrl: "https://via.placeholder.com/150/D1C4E9/FFFFFF?text=IU" },
          { id: "m2", artist: "아이유", title: "Love wins all", albumArtUrl: "https://via.placeholder.com/150/FFCDD2/FFFFFF?text=IU" },
          { id: "m3", artist: "아이유", title: "삐삐", albumArtUrl: "https://via.placeholder.com/150/FFCDD2/FFFFFF?text=IU" },
          { id: "m4", artist: "아이유", title: "겨울잠", albumArtUrl: "https://via.placeholder.com/150/FFCDD2/FFFFFF?text=IU" },
        ];
      } else if (searchQuery) {
        mockResults = [
          { id: "m99", artist: searchQuery, title: "검색된 노래 1", albumArtUrl: "https://via.placeholder.com/150/B2EBF2/FFFFFF?text=Search" },
        ];
      }

      setSearchResults(mockResults);
    } catch (err) {
      console.error(err);
    }

    setIsSearching(false);
  };

  const selectSong = (song) => {
    setSelectedSong(song);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="form-group music-section-outer">
      <label>음악 (1곡)</label>
      <div className="music-and-art-wrapper">
        <div className="album-art-container">
          {selectedSong ? (
            <img src={selectedSong.albumArtUrl} alt={selectedSong.title} className="selected-album-art" />
          ) : (
            <div className="album-art-placeholder">
              음악앨범표지
              <span>API</span>
            </div>
          )}
        </div>

        <div className="music-select-container">
          {!selectedSong ? (
            <div className="music-search-section">
              <div className="music-search-box">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="아티스트, 곡명 검색"
                />
                <button
                  type="button"
                  onClick={handleMusicSearch}
                  disabled={isSearching}
                  className="form-button"
                >
                  {isSearching ? "..." : "검색"}
                </button>
              </div>
              <ul className="search-results-list">
                {searchResults.length === 0 && searchQuery && !isSearching && (
                  <li className="no-results">검색 결과가 없습니다.</li>
                )}
                {searchResults.map((song) => (
                  <li key={song.id} onClick={() => selectSong(song)}>
                    <strong>{song.artist}</strong> - {song.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="selected-song">
              <div className="song-info">
                <strong>♫ {selectedSong.artist}</strong> - {selectedSong.title}
              </div>
              <button type="button" onClick={() => setSelectedSong(null)} className="form-button">
                변경
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicSelector;
