const RecommendationCard = ({ item }) => (
  <div className="recommendation-card-wrapper">
    <button 
      className="rec-button" 
      onClick={() => alert(item.alert)}
    >
      {item.text}
    </button>
  </div>
);

export default RecommendationCard;