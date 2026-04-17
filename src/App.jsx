import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Auth from "./pag/Auth/Auth";
import Home from "./pag/Home/Home";
import { useEffect } from "react";
import { usePuterStore } from "./lib/puter";
import Upload from "./pag/upload/Upload";
import Resume from "./pag/resume/Resume";

function App() {
  const { init, auth } = usePuterStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      {/* <h1>ajsdfm sdfa</h1> */}
      {/* <Home /> */}
      <Routes>
        <Route
          path="/"
          element={

            auth.isAuthenticated ? (
              <Home />
            ) : (
              <Navigate to="/auth?next=/" replace />
            )
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/resume/:id" element={<Resume />} />
      </Routes>
    </>
  );
}

export default App;