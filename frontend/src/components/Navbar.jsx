import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to={user?.role === "educator" ? "/dashboard/teacher" : "/dashboard/student"}>
          RuralEdu
        </Link>
      </div>
      <nav className="navbar__links">
        <Link to="/courses">Courses</Link>
        {user?.role === "educator" && <Link to="/dashboard/teacher">Teacher</Link>}
        {user?.role === "student" && <Link to="/dashboard/student">Student</Link>}
      </nav>
      <div className="navbar__user">
        {user ? (
          <>
            <span className="navbar__name">{user.name}</span>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </header>
  );
};

