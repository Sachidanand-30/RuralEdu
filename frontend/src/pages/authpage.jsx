import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  School,
  ArrowRight,
  BookOpen,
  Loader2
} from "lucide-react";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [role, setRole] = useState("student");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    grade: "1st",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password, role });
      } else {
        await register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role,
          grade: role === "student" ? formData.grade : undefined,
        });
      }

      navigate(role === "educator" ? "/dashboard/teacher" : "/dashboard/student");
    } catch (error) {
      console.error("Auth Error:", error);
      const errorMessage = error.response?.data?.message || "Connection failed. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">

      {/* LEFT SIDE: Image */}
      <div className="hidden lg:flex w-1/2 relative bg-indigo-900 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2600&auto=format&fit=crop"
            alt="Education Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-indigo-900/90" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-indigo-300" />
            </div>
            <span>RuralEdu</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">
            Empowering every student, <br />
            <span className="text-indigo-300">everywhere.</span>
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Join a community dedicated to bridging the educational gap.
            Access world-class resources regardless of your location.
          </p>
        </div>

        <div className="relative z-10 text-sm text-indigo-300">
          © 2024 RuralEdu LMS. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Get started with your learning journey today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="bg-gray-200/50 p-1 rounded-xl flex shadow-inner">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${role === "student"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("educator")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${role === "educator"
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <School className="w-4 h-4" />
              Educator
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="John Doe"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white text-gray-900"
                  />
                </div>
              </div>
            )}

            {!isLogin && role === "student" && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Select Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white text-gray-900"
                >
                  {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map((g) => (
                    <option key={g} value={g}>{g} grade</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isLogin
                    ? `Sign in as ${role === "student" ? "Student" : "Educator"}`
                    : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};