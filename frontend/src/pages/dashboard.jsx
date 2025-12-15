import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiMultipart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { getYoutubeEmbedUrl } from "../lib/youtube";

const Loading = () => <div className="flex justify-center p-12"><p className="text-slate-500">Loading...</p></div>;
const ErrorMsg = ({ message }) => <div className="p-4 bg-red-50 text-red-600 rounded-lg">{message}</div>;

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/dashboard/student");
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {data.myCourses?.length || 0} enrolled
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.myCourses?.map((course) => (
            <div key={course._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{course.description || "No description"}</p>
              <p className="text-slate-500 text-sm mb-4">Educator: {course.educator?.name || "N/A"}</p>
              {course.lessons?.length > 0 && (
                <div className="mt-3">
                  <button
                    className="inline-flex justify-center items-center px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    View lessons
                  </button>
                </div>
              )}
            </div>
          ))}
          {data.myCourses?.length === 0 && <p className="text-slate-500">No enrollments yet.</p>}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Available Educators</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {data.educators?.length || 0} educators
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.educators?.map((ed) => (
            <div key={ed._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{ed.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{ed.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EducatorDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", grade: "1st" });
  const [lessonForm, setLessonForm] = useState({ courseId: "", title: "", youtubeUrl: "" });
  const [assignmentForm, setAssignmentForm] = useState({ courseId: "", title: "", instructions: "", pdf: null });

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/dashboard/educator");
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCourseCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/courses/create", form);
      setForm({ title: "", description: "", grade: "1st" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleLessonAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/courses/${lessonForm.courseId}/lessons`, {
        title: lessonForm.title,
        youtubeUrl: lessonForm.youtubeUrl,
      });
      setLessonForm({ courseId: "", title: "", youtubeUrl: "" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add lesson");
    }
  };

  const handleAssignmentAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", assignmentForm.title);
      formData.append("instructions", assignmentForm.instructions);
      if (assignmentForm.pdf) formData.append("pdf", assignmentForm.pdf);

      await apiMultipart.post(`/courses/${assignmentForm.courseId}/assignments`, formData);
      setAssignmentForm({ courseId: "", title: "", instructions: "", pdf: null });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload assignment");
    }
  };

  const InputClass = "block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border border-slate-300";
  const ButtonClass = "inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors border-none cursor-pointer";

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">At a Glance</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {data.totalCourses} courses
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Total Courses</h3>
            <p className="text-4xl font-bold text-slate-900">{data.totalCourses}</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create Course</h2>
        </div>
        <form className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-sm" onSubmit={handleCourseCreate}>
          <input
            required
            placeholder="Course title"
            className={InputClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className={InputClass}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            required
            className={InputClass}
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          >
            {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map((g) => (
              <option key={g} value={g}>{g} grade</option>
            ))}
          </select>
          <button type="submit" className={ButtonClass}>Create</button>
        </form>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {data.courses?.length || 0} active
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses?.map((course) => (
            <div key={course._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{course.description || "No description"}</p>
              <p className="text-slate-500 text-sm mb-4">Grade: {course.grade}</p>
              <p className="text-slate-500 text-sm mb-4">Students: {course.studentsEnrolled}</p>
            </div>
          ))}
          {data.courses?.length === 0 && <p className="text-slate-500">No courses yet.</p>}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add Lesson</h2>
        </div>
        <form className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-sm" onSubmit={handleLessonAdd}>
          <select
            required
            className={InputClass}
            value={lessonForm.courseId}
            onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value })}
          >
            <option value="">Select course</option>
            {data.courses?.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <input
            required
            placeholder="Lesson title"
            className={InputClass}
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
          />
          <input
            required
            placeholder="YouTube URL"
            className={InputClass}
            value={lessonForm.youtubeUrl}
            onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
          />
          <button type="submit" className={ButtonClass}>Add lesson</button>
        </form>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Upload Assignment (PDF)</h2>
        </div>
        <form className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-xl border border-slate-200 shadow-sm" onSubmit={handleAssignmentAdd}>
          <select
            required
            className={InputClass}
            value={assignmentForm.courseId}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, courseId: e.target.value })}
          >
            <option value="">Select course</option>
            {data.courses?.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <input
            required
            placeholder="Assignment title"
            className={InputClass}
            value={assignmentForm.title}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
          />
          <textarea
            placeholder="Instructions"
            className={InputClass}
            value={assignmentForm.instructions}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
          />
          <input
            type="file"
            accept="application/pdf"
            className={InputClass}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, pdf: e.target.files?.[0] || null })}
          />
          <button type="submit" className={ButtonClass}>Upload</button>
        </form>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      <Navbar />
      {user.role === "student" ? <StudentDashboard /> : <EducatorDashboard />}
    </>
  );
};

