import { Link } from "react-router";

function Navpar() {
  return (
    <div className="container">
      <nav className="navbar  ">
        <Link to="/">
          <p className="text-gradient text-uppercase fw-bold h5  mb-0">
            resumind
          </p>
        </Link>
        <Link to="/upload" className="primary-button w-auto ">
          Upload Resume
        </Link>
      </nav>
    </div>
  );
}

export default Navpar
