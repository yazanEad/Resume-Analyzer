const getScoreData = (score) => {
  if (score > 69) {
    return {
      wrapperClass: "resume-score-pill-good",
      textClass: "resume-score-text-good",
      icon: "/public/icons/check.svg",
    };
  }

  if (score > 39) {
    return {
      wrapperClass: "resume-score-pill-mid",
      textClass: "resume-score-text-mid",
      icon: "/public/icons/ats-warning.svg",
    };
  }

  return {
    wrapperClass: "resume-score-pill-low",
    textClass: "resume-score-text-low",
    icon: "/public/icons/ats-warning.svg",
  };
};

const CategoryScore = ({ score }) => {
  const { wrapperClass, textClass, icon } = getScoreData(score);

  return (
    <span className={`resume-score-pill ${wrapperClass}`}>
      <img src={icon} alt="score status" className="resume-tip-icon" />
      <span className={`fw-semibold ${textClass}`}>{score}/100</span>
    </span>
  );
};

const CategoryHeader = ({ title, categoryScore }) => {
  return (
    <div className="resume-category-header d-flex flex-wrap align-items-center gap-3">
      <p className="h4 fw-semibold mb-0">{title}</p>
      <CategoryScore score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({ tips = [] }) => {
  if (!tips.length) {
    return (
      <p className="text-secondary mb-0">
        No suggestions available for this category yet.
      </p>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 w-100">
      <div className="resume-tip-overview">
        <div className="row g-3">
          {tips.map((tip, index) => (
            <div
              className="col-12 col-md-6"
              key={`quick-tip-${index}-${tip.tip}`}
            >
              <div className="resume-tip-overview-item d-flex align-items-start gap-2">
                <img
                  src={
                    tip.type === "good"
                      ? "/public/icons/check.svg"
                      : "/public/icons/ats-warning.svg"
                  }
                  alt="tip status"
                  className="resume-tip-icon"
                />
                <p className="mb-0">{tip.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {tips.map((tip, index) => {
          const isGood = tip.type === "good";

          return (
            <div
              key={`detail-tip-${index}-${tip.tip}`}
              className={`resume-tip-card ${
                isGood ? "resume-tip-card-good" : "resume-tip-card-warning"
              }`}
            >
              <div className="d-flex align-items-start gap-2">
                <img
                  src={
                    isGood
                      ? "/public/icons/check.svg"
                      : "/public/icons/ats-warning.svg"
                  }
                  alt="tip status"
                  className="resume-tip-icon"
                />
                <p className="resume-tip-title">{tip.tip}</p>
              </div>

              {tip.explanation ? (
                <p className="resume-tip-explanation">{tip.explanation}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Details = ({ feedback }) => {
  const categories = [
    {
      id: "tone-style",
      title: "Tone & Style",
      score: feedback?.toneAndStyle?.score ?? 0,
      tips: feedback?.toneAndStyle?.tips ?? [],
    },
    {
      id: "content",
      title: "Content",
      score: feedback?.content?.score ?? 0,
      tips: feedback?.content?.tips ?? [],
    },
    {
      id: "structure",
      title: "Structure",
      score: feedback?.structure?.score ?? 0,
      tips: feedback?.structure?.tips ?? [],
    },
    {
      id: "skills",
      title: "Skills",
      score: feedback?.skills?.score ?? 0,
      tips: feedback?.skills?.tips ?? [],
    },
  ];

  return (
    <div className="resume-details w-100">
      <div className="accordion" id="resume-details-accordion">
        {categories.map((category, index) => {
          const headingId = `resume-${category.id}-header`;
          const collapseId = `resume-${category.id}-content`;
          const expanded = index === 0;

          return (
            <div className="accordion-item resume-accordion-item" key={category.id}>
              <h2 className="accordion-header" id={headingId}>
                <button
                  className={`accordion-button ${expanded ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded={expanded ? "true" : "false"}
                  aria-controls={collapseId}
                >
                  <CategoryHeader
                    title={category.title}
                    categoryScore={category.score}
                  />
                </button>
              </h2>
              <div
                id={collapseId}
                className={`accordion-collapse collapse ${expanded ? "show" : ""}`}
                aria-labelledby={headingId}
                data-bs-parent="#resume-details-accordion"
              >
                <div className="accordion-body">
                  <CategoryContent tips={category.tips} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Details;
