import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
        }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg text-white transform group-hover:scale-110 transition-transform duration-200">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700">
              RuralEdu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/courses">Courses</NavLink>
            {user?.role === "educator" && <NavLink to="/dashboard/teacher">Educator Dashboard</NavLink>}
            {user?.role === "student" && <NavLink to="/dashboard/student">My Dashboard</NavLink>}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <User size={16} />
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-full shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/courses"
              className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
            {user?.role === "educator" && (
              <Link
                to="/dashboard/teacher"
                className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Educator Dashboard
              </Link>
            )}
            {user?.role === "student" && (
              <Link
                to="/dashboard/student"
                className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                My Dashboard
              </Link>
            )}

            <div className="border-t border-slate-100 my-2 pt-2">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-slate-500">
                    Signed in as {user.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid gap-2 p-2">
                  <Link
                    to="/"
                    className="flex justify-center w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/"
                    className="flex justify-center w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

