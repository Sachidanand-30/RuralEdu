import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getYoutubeEmbedUrl } from "../lib/youtube";
import { BookOpen, User, Loader2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

export const CoursesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [educators, setEducators] = useState([]);
  const [enrolling, setEnrolling] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "student") {
          const { data } = await api.get("/enrollments/my-courses");
          setEnrolledIds(new Set(data.map(e => e.course._id)));
        }

        if (user?.role === "student" && user?.grade) {
          const { data } = await api.get(`/courses?grade=${encodeURIComponent(user.grade)}`);
          setCourses(data);
        } else {
          const { data } = await api.get("/courses");
          setCourses(data);
        }

        const { data: eds } = await api.get("/courses/educators");
        setEducators(eds);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load courses");
      }
    };
    fetchData();
  }, [user]);

  const enroll = async (courseId) => {
    setError("");
    setMessage("");
    setEnrolling(courseId);
    try {
      const { data } = await api.post(`/enrollments/enroll/${courseId}`);
      setMessage(data.message || "Enrolled");
      setEnrolledIds(prev => new Set(prev).add(courseId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling("");
    }
  };



  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700">
            {user?.role === "student" && user.grade
              ? `Courses for ${user.grade} Grade`
              : "Explore Courses"}
          </h1>
          <p className="mt-2 text-slate-600">
            Discover a wide range of courses tailored to your educational journey.
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
            <BookOpen className="w-4 h-4 mr-2" />
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm">
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg shadow-sm">
            <p className="font-medium text-sm">{message}</p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {course.grade} Grade
                  </span>
                  {course.educator && (
                    <span className="text-xs text-slate-500 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {course.educator.name}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {course.description || "No description provided for this course."}
                </p>

                <div className="flex items-center text-xs text-slate-500 mb-6">
                  <span className="flex items-center mr-4">
                    <User className="w-4 h-4 mr-1.5" />
                    {course.studentsEnrolled} Students
                  </span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto space-y-3">
                {user?.role === "student" && (
                  <button
                    onClick={() => enroll(course._id)}
                    disabled={enrolling === course._id || enrolledIds.has(course._id)}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed transition-colors ${enrolledIds.has(course._id)
                        ? "bg-green-600 hover:bg-green-700 disabled:bg-green-600"
                        : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                      }`}
                  >
                    {enrolling === course._id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enrolling...
                      </>
                    ) : enrolledIds.has(course._id) ? (
                      "Enrolled"
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                )}

                {course.lessons?.length > 0 && (
                  <div className="w-full">
                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      View {course.lessons.length} Lessons <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                )}
              </div>

              {/* Removed: Expanded Lessons block */}
            </div>
          ))}
        </div>

        {courses.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="mx-auto h-12 w-12 text-slate-400">
              <BookOpen className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No courses available</h3>
            <p className="mt-1 text-sm text-slate-500">Check back later for new content.</p>
          </div>
        )}

        {/* Educators Section */}
        <div className="border-t border-slate-200 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Educators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {educators.map((ed) => (
              <div key={ed._id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{ed.name}</p>
                    <p className="text-xs text-slate-500 truncate">{ed.email}</p>
                  </div>
                </div>
              </div>
            ))}
            {educators.length === 0 && (
              <p className="text-sm text-slate-500 col-span-full">No educators list available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

