const TagsSection = () => {
  const tags = ["#힙합", "#발라드", "#감성", "#드라이브", "#새벽감성", "#운동", "#비오는날", "#카페", "#인디음악", "#팝송", "#재즈", "#클래식", "#뉴에이지"];

  const renderTags = () =>
    tags.map((tag, index) => (
      <span key={index} className="tag" onClick={() => alert(`${tag} 태그 검색`)}>
        {tag}
      </span>
    ));

  return (
    <div className="tags-section">
      <div className="tags-wrapper">
        <div className="tags-container">
            {renderTags()}
        </div>
        <div className="tags-container" aria-hidden="true"> 
            {renderTags()}
        </div>
      </div>
    </div>
  );
};

export default TagsSection;