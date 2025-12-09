import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export const HomePage = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "educator" ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="card" style={{ padding: "28px" }}>
          <h1 style={{ marginBottom: "8px" }}>Welcome back{user ? `, ${user.name}` : ""}!</h1>
          <p className="muted">Choose where you want to go next.</p>

          <div className="grid" style={{ marginTop: "16px" }}>
            <div className="card">
              <h3>Dashboard</h3>
              <p className="muted">Your personalized space with stats and actions.</p>
              <Link to={dashboardPath} className="btn">Open dashboard</Link>
            </div>
            <div className="card">
              <h3>Courses</h3>
              <p className="muted">Browse educators and enroll in courses.</p>
              <Link to="/courses" className="btn">Explore courses</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

