import React, { useState } from 'react';
// CSS 파일 경로를 src/pages/ -> src/ 로 수정합니다.
import './WritePage.css'; 

// ------------------------------------------------------------------
// ⭐️ [페이지 컴포넌트] 글쓰기 페이지
// ------------------------------------------------------------------
const WritePage = () => {
  // ... (폼 데이터 state, API state 등은 기존과 동일) ...
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null); 
  const [isSearching, setIsSearching] = useState(false);
  const [memoryLine, setMemoryLine] = useState(''); 
  const [mainText, setMainText] = useState(''); 
  const [uploadedImage, setUploadedImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(''); 

  // (Mock) 음악 API 검색 함수
  const handleMusicSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // ⭐️ (시뮬레이션) API 결과에 앨범 표지(albumArtUrl) 추가
    const mockResults = [
      { id: 'm1', artist: '아이유', title: '밤편지', albumArtUrl: 'https://via.placeholder.com/150/D1C4E9/FFFFFF?text=IU' },
      { id: 'm2', artist: '아이유', title: 'Love wins all', albumArtUrl: 'https://via.placeholder.com/150/FFCDD2/FFFFFF?text=IU' },
      { id: 'm3', artist: `${searchQuery}`, title: '검색된 노래', albumArtUrl: 'https://via.placeholder.com/150/B2EBF2/FFFFFF?text=Search' },
    ];
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  // (음악 선택, 사진 업로드, 폼 제출 함수는 기존과 동일)
  const selectSong = (song) => {
    setSelectedSong(song);
    setSearchResults([]); 
    setSearchQuery(''); 
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSong) {
      alert('음악을 선택해주세요.');
      return;
    }
    alert(`
      새 게시물 등록 완료!
      선택한 곡: ${selectedSong.artist} - ${selectedSong.title}
      한 줄 추억: ${memoryLine}
      본론: ${mainText}
      이미지: ${uploadedImage ? uploadedImage.name : '없음'}
    `);
  };

  return (
    <main className="main-content">
      <div className="write-form-container">
        <h2>새 게시물 작성</h2>
        <form onSubmit={handleSubmit}>
          
          {/* --- 1. 음악 & 앨범 표지 섹션 --- */}
          <div className="form-group">
            <label>음악 (1곡)</label>
            
            {/* ⭐️ 앨범 표지와 음악 검색 영역을 묶는 래퍼 */}
            <div className="music-and-art-wrapper">
              
              {/* 1-1. 앨범 표지 영역 */}
              <div className="album-art-container">
                {selectedSong ? (
                  // ⭐️ 노래 선택 시: 앨범 표지 표시
                  <img src={selectedSong.albumArtUrl} alt={`${selectedSong.title} 앨범 표지`} className="selected-album-art" />
                ) : (
                  // ⭐️ 노래 선택 전: 플레이스홀더 표시 (이미지 참고)
                  <div className="album-art-placeholder">
                    음악앨범표지
                    <span>API</span>
                  </div>
                )}
              </div>
              
              {/* 1-2. 음악 검색/선택 영역 */}
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
                      <button type="button" onClick={handleMusicSearch} disabled={isSearching}>
                        {isSearching ? '...' : '검색'}
                      </button>
                    </div>
                    <ul className="search-results-list">
                      {searchResults.map(song => (
                        <li key={song.id} onClick={() => selectSong(song)}>
                          <strong>{song.artist}</strong> - {song.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="selected-song">
                    <div className="song-info">
                      <strong>♫ {selectedSong.artist}</strong>
                      <span> - {selectedSong.title}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedSong(null)} className="change-btn">
                      변경
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* --- 2. 한 줄 추억 --- */}
          <div className="form-group">
            <label htmlFor="memory-line">한 줄 추억</label>
            <input 
              type="text" 
              id="memory-line" 
              value={memoryLine}
              onChange={(e) => setMemoryLine(e.target.value)}
              placeholder="이 음악과 관련된 추억을 한 줄로 표현해보세요."
              required 
            />
          </div>
          
          {/* --- 3. 본론 (블로그 형식) --- */}
          <div className="form-group">
            <label htmlFor="main-text">본론</label>
            <textarea 
              id="main-text" 
              rows="8"
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="블로그처럼 사진과 글이 섞여 자유롭게 일기 쓸 수 있도록 구성 (본문)"
            ></textarea>
          </div>

          {/* --- 4. 사진 넣는 기능 --- */}
          <div className="form-group file-upload-wrapper">
            <label htmlFor="file-upload">사진 첨부</label>
            <div className="file-upload-box">
              {imagePreview ? (
                <img src={imagePreview} alt="업로드 미리보기" className="image-preview" />
              ) : (
                <>
                  <span>+</span>
                  <p>추억이 담긴 사진 업로드</p>
                </>
              )}
            </div>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* --- 제출 버튼 --- */}
          <button type="submit" className="submit-btn">
            등록하기
          </button>
        </form>
      </div>
    </main>
  );
};

export default WritePage;