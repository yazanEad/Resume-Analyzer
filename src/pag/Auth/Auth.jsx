import { useEffect } from "react";
import "./auth.css";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "../../lib/puter";

function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next, { replace: true });
    }
  }, [auth.isAuthenticated, navigate, next]);

  return (
    <main className="log d-flex justify-content-center align-items-center">
      <div className="col-10 col-md-8  col-lg-6">
        <div className="gradient-border shadow-lg">
          <section className=" bg-white rounded-4 p-4">
            <div className=" text-center">
              <h1>Welcome</h1>
              <h2 className="my-3">Log In to Continue Your Job Journey</h2>
            </div>
            <div>
              {isLoading ? (
                <button className="primary-button border-0">
                  <p className="mb-0 h4">Signing you in...</p>
                </button>
              ) : (
                <>
                  {auth.isAuthenticated ? (
                    <button
                      className="primary-button border-0"
                      onClick={auth.signOut}
                    >
                      <p className="mb-0 h4">Log Out</p>
                    </button>
                  ) : (
                    <button
                      className="primary-button border-0"
                      onClick={auth.signIn}
                    >
                      <p className="mb-0 h4">Log In</p>
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Auth;