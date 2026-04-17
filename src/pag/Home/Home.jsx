import Navpar from "../../Components/Navpar";
import ResumeCard from "../../Components/ResumeCard.jsx";
import { resumes } from "../../data.jsx";
import "./home.css";

function Home() {
  return (
    <main className="home pb-4">
      <div className=" container  ">
        <Navpar />
        <div className="page-heading my-5 mx-auto col-12 col-md-10">
          <h1 className="home-title ">
            Track Your Applications & Resume Ratings
          </h1>
          <p className="home-subtitle mt-3">
            Review your submissions and check AI-powered feedback.
          </p>
        </div>
      </div>
      {resumes.length > 0 && (
        <div className=" container-fluid">
          <div className="row row-cols-1  row-cols-md-2 row-cols-xxl-3 g-4 justify-content-center mt-4">
            {resumes.map((res) => {
              return <ResumeCard key={res.id} resumes={res} />;
            })}
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;