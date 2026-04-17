const getBadgeData = (score) => {
  if (score > 70) {
    return { text: "Strong", className: "score-badge-pill score-badge-strong" };
  }

  if (score > 49) {
    return { text: "Good Start", className: "score-badge-pill score-badge-mid" };
  }

  return { text: "Needs Work", className: "score-badge-pill score-badge-low" };
};

const ScoreBadge = ({ score = 0 }) => {
  const { text, className } = getBadgeData(score);

  return (
    <span className={`badge rounded-pill fw-semibold ${className}`}>{text}</span>
  );
};

export default ScoreBadge;
