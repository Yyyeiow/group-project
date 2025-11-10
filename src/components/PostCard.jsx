const PostCard = ({ post, onSaveToggle }) => {
  const handleSaveClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onSaveToggle(post.id);
  };

  const musicInfoTextClass = `music-info-text ${post.overflow ? 'overflow' : ''}`;
  const uniqueId = `heart-${post.id}`;

  return (
    <div className="post-card" onClick={() => alert('게시물 상세 페이지로 이동')}>
      <div className="post-image">
        사진
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
            checked={post.saved}
            onChange={handleSaveClick}
            onClick={(e) => e.stopPropagation()}
          />
          <label className="like" htmlFor={uniqueId} onClick={(e) => e.stopPropagation()}>
            <svg
              className="like-icon"
              fill-rule="nonzero"
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