import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const getScoreTextClass = (score) => {
  if (score > 70) return "score-text-strong";
  if (score > 49) return "score-text-mid";
  return "score-text-low";
};

const Category = ({ title, score }) => {
  return (
    <div className="resume-summary-item">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <p className="h5 mb-0">{title}</p>
        <ScoreBadge score={score} />
      </div>
      <p className="h5 mb-0 fw-semibold">
        <span className={getScoreTextClass(score)}>{score}</span>/100
      </p>
    </div>
  );
};

const Summary = ({ feedback }) => {
  return (
    <div className="card shadow-sm border-0 resume-summary-card w-100">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
          <ScoreGauge score={feedback.overallScore} />

          <div>
            <h2 className="h3 fw-bold mb-2 text-dark">Your Resume Score</h2>
            <p className="text-secondary mb-0">
              This score is calculated based on the variables listed below.
            </p>
          </div>
        </div>

        <div className="d-flex flex-column gap-3 resume-summary-list">
          <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
          <Category title="Content" score={feedback.content.score} />
          <Category title="Structure" score={feedback.structure.score} />
          <Category title="Skills" score={feedback.skills.score} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
