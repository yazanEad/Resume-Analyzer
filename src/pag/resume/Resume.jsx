import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "../../lib/puter";
import Summary from "../../Components/Summary";
import ATS from "../../Components/ATS";
import Details from "../../Components/Details";
import "./resume.css";



const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    let nextResumeUrl = "";
    let nextImageUrl = "";

    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      nextResumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(nextResumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      nextImageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(nextImageUrl);

      setFeedback(data.feedback);
    };

    loadResume();

    return () => {
      if (nextResumeUrl) URL.revokeObjectURL(nextResumeUrl);
      if (nextImageUrl) URL.revokeObjectURL(nextImageUrl);
    };
  }, [fs, id, kv]);

  return (
    <main className="resume-page pt-0">
      <nav className="resume-nav border-bottom">
        <div className="container-fluid">
          <Link to="/" className="back-button btn btn-outline-secondary">
            <img
              src="/public/icons/back.svg"
              alt="Back"
              className="resume-back-icon"
            />
            <span className="fw-semibold">Back to Homepage</span>
          </Link>
        </div>
      </nav>

      <div className="resume-layout d-flex flex-column-reverse flex-lg-row w-100">
        <section className="resume-preview-section d-flex align-items-center justify-content-center">
          {imageUrl && resumeUrl ? (
            <div className="resume-preview-frame">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="resume-preview-image"
                  title="resume"
                  alt="Resume preview"
                />
              </a>
            </div>
          ) : null}
        </section>

        <section className="resume-content-section">
          <h2 className="resume-page-title mb-0">Resume Review</h2>

          {feedback ? (
            <div className="d-flex flex-column gap-4">
              <Summary feedback={feedback} />
              <ATS
                score={feedback?.ATS?.score || 0}
                suggestions={feedback?.ATS?.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img
              src="/public/images/resume-scan-2.gif"
              className="img-fluid w-100 resume-loading-image"
              alt="Resume analysis in progress"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
