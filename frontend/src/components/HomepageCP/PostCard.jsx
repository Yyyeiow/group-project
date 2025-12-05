import { useNavigate } from 'react-router-dom';
import { toggleLike } from '../../api/api';
import './HomepageCPcss/PostCard.css';

const PostCard = ({ post, isSaved, onSaveToggle }) => {
  const navigate = useNavigate();

  const handleSaveClick = async (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    
    try {
      const result = await toggleLike(post.id);
      onSaveToggle(post.id, result.isLiked);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      alert('로그인이 필요합니다!');
    }
  };

  const handleCardClick = () => {
    // 게시물 상세 페이지로 이동 (아직 페이지가 없으면 alert)
    alert(`게시물 ${post.id} 상세 페이지 (아직 구현 안됨)`);
    // navigate(`/post/${post.id}`); // 상세 페이지 구현 후 활성화
  };

  const musicInfoTextClass = `music-info-text ${post.overflow ? 'overflow' : ''}`;
  const uniqueId = `heart-${post.id}`;

  // 이미지 URL 결정: 앨범 커버 우선! (Spotify 이미지는 외부 URL)
  const imageUrl = post.albumImageUrl;

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-image" style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {!imageUrl && <div style={{padding: '20px', textAlign: 'center'}}>이미지 없음</div>}
        <div className="post-description">{post.description}</div>
      </div>
      <div className="post-info">
        <div className="music-info">
          <span className={musicInfoTextClass}>
            <span className="artist-name">{post.artist}</span>
            <span className="separator">-</span>
            <span className="music-title">{post.title}</span>
            {post.overflow && (
              <>
                <span className="artist-name" style={{ marginLeft: '20px' }}>{post.artist}</span>
                <span className="separator">-</span>
                <span className="music-title">{post.title}</span>
              </>
            )}
          </span>
        </div>
        
        <div className="like-button">
          <input 
            className="on" 
            id={uniqueId}
            type="checkbox"
            checked={isSaved !== undefined ? isSaved : post.saved}
            onChange={handleSaveClick}
            onClick={(e) => e.stopPropagation()}
          />
          <label className="like" htmlFor={uniqueId} onClick={(e) => e.stopPropagation()}>
            <svg
              className="like-icon"
              fillRule="nonzero"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
              ></path>
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostCard;