import ScoreCircle from "./ScoreCircle";




function ResumeCard({ resumes }) {
  return (
    <div className="col">
      <div className=" resume-card ">
        <div className="d-flex  flex-column flex-md-row  justify-content-md-between align-items-center text-center text-md-start my-4">
          <div>
            <h3 className=" fw-bold" style={{ color: "#1D2939" }}>
              {resumes.companyName}
            </h3>
            <h5 className=" fw-medium" style={{ color: "#475467" }}>
              {resumes.jobTitle}
            </h5>
          </div>
          <div>
            <ScoreCircle score={resumes.feedback.overallScore} />
          </div>
        </div>
        <div className=" img-cv ">
          <img src={`/public/images/${resumes.imagePath}`} alt="" />
        </div>
      </div>
    </div>
  );
}

export default ResumeCard
