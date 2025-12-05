import React, { useState } from "react";
import "./WritepageCPcss/MusicSelector.css";
import { searchMusic } from "../../api/api"; // 백엔드 API 가져오기

const MusicSelector = ({ selectedSong, setSelectedSong }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * 🎵 음악 검색 함수
   * 백엔드를 통해 Spotify API에서 노래를 검색합니다!
   */
  const handleMusicSearch = async () => {
    // 검색어가 비어있으면 아무것도 안 함
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }

    setIsSearching(true); // 로딩 시작

    try {
      // 백엔드 API 호출 (Spotify 검색)
      console.log("음악 검색 중:", searchQuery);
      const data = await searchMusic(searchQuery);
      
      // 백엔드에서 받은 데이터를 프론트엔드 형식으로 변환
      // 백엔드: { trackId, trackName, artistName, albumImageUrl }
      // 프론트엔드: { id, title, artist, albumArtUrl }
      const formattedResults = data.map(track => ({
        id: track.trackId,          // Spotify 트랙 ID
        title: track.trackName,     // 노래 제목
        artist: track.artistName,   // 아티스트 이름
        albumArtUrl: track.albumImageUrl // 앨범 커버 이미지
      }));

      console.log("검색 결과:", formattedResults);
      setSearchResults(formattedResults);

      if (formattedResults.length === 0) {
        alert("검색 결과가 없습니다. 다른 검색어를 시도해보세요!");
      }

    } catch (error) {
      console.error("음악 검색 에러:", error);
      alert("음악 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSearching(false); // 로딩 종료
    }
  };

  /**
   * 🎯 노래 선택 함수
   * 검색 결과에서 노래를 클릭하면 선택됩니다
   */
  const selectSong = (song) => {
    console.log("노래 선택:", song);
    setSelectedSong(song);
    setSearchResults([]); // 검색 결과 지우기
    setSearchQuery(""); // 검색어 지우기
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
