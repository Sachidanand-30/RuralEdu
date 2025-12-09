import { useEffect, useState } from "react";
import { api, apiMultipart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { getYoutubeEmbedUrl } from "../lib/youtube";

const Loading = () => <p>Loading...</p>;
const ErrorMsg = ({ message }) => <p className="error">{message}</p>;

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

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
    <div className="page">
      <div className="section">
        <div className="section-header">
          <h2>My Courses</h2>
          <span className="chip">{data.myCourses?.length || 0} enrolled</span>
        </div>
        <div className="grid">
          {data.myCourses?.map((course) => (
            <div key={course._id} className="card">
              <h3>{course.title}</h3>
              <p className="muted">{course.description || "No description"}</p>
              <p className="muted">Educator: {course.educator?.name || "N/A"}</p>
              {course.lessons?.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      setExpanded((prev) => ({ ...prev, [course._id]: !prev[course._id] }))
                    }
                  >
                    {expanded[course._id] ? "Hide lessons" : "View lessons"}
                  </button>
                  {expanded[course._id] && (
                    <div className="lesson-grid">
                      {course.lessons.map((lesson) => {
                        const embedUrl = getYoutubeEmbedUrl(lesson.youtubeUrl);
                        return (
                          <div key={lesson._id} className="lesson-card-wide">
                            <div className="lesson-header">
                              <h4 className="lesson-title">{lesson.title}</h4>
                            </div>
                            {embedUrl ? (
                              <div className="video-wrapper video-compact">
                                <iframe
                                  src={embedUrl}
                                  title={lesson.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <p className="error">Invalid YouTube URL</p>
                            )}
                            <div className="lesson-actions">
                              <a className="btn-secondary" href={lesson.youtubeUrl} target="_blank" rel="noreferrer">
                                Open in YouTube
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {data.myCourses?.length === 0 && <p>No enrollments yet.</p>}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Available Educators</h2>
          <span className="chip">{data.educators?.length || 0} educators</span>
        </div>
        <div className="grid">
          {data.educators?.map((ed) => (
            <div key={ed._id} className="card">
              <h3>{ed.name}</h3>
              <p className="muted">{ed.email}</p>
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

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} />;

  return (
    <div className="page">
      <div className="section">
        <div className="section-header">
          <h2>At a Glance</h2>
          <span className="chip">{data.totalCourses} courses</span>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Total Courses</h3>
            <p className="stat">{data.totalCourses}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Create Course</h2>
        </div>
        <form className="form" onSubmit={handleCourseCreate}>
          <input
            required
            placeholder="Course title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            required
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          >
            {["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"].map((g) => (
              <option key={g} value={g}>{g} grade</option>
            ))}
          </select>
          <button type="submit" className="btn">Create</button>
        </form>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>My Courses</h2>
          <span className="chip">{data.courses?.length || 0} active</span>
        </div>
        <div className="grid">
          {data.courses?.map((course) => (
            <div key={course._id} className="card">
              <h3>{course.title}</h3>
              <p className="muted">{course.description || "No description"}</p>
              <p className="muted">Grade: {course.grade}</p>
              <p className="muted">Students: {course.studentsEnrolled}</p>
            </div>
          ))}
          {data.courses?.length === 0 && <p>No courses yet.</p>}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Add Lesson</h2>
        </div>
        <form className="form" onSubmit={handleLessonAdd}>
          <select
            required
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
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
          />
          <input
            required
            placeholder="YouTube URL"
            value={lessonForm.youtubeUrl}
            onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
          />
          <button type="submit" className="btn">Add lesson</button>
        </form>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Upload Assignment (PDF)</h2>
        </div>
        <form className="form" onSubmit={handleAssignmentAdd}>
          <select
            required
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
            value={assignmentForm.title}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
          />
          <textarea
            placeholder="Instructions"
            value={assignmentForm.instructions}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setAssignmentForm({ ...assignmentForm, pdf: e.target.files?.[0] || null })}
          />
          <button type="submit" className="btn">Upload</button>
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

