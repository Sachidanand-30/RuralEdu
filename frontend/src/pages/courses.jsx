import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getYoutubeEmbedUrl } from "../lib/youtube";

export const CoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [educators, setEducators] = useState([]);
  const [enrolling, setEnrolling] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For students: fetch courses filtered by their grade
        if (user?.role === "student" && user?.grade) {
          const { data } = await api.get(`/courses?grade=${encodeURIComponent(user.grade)}`);
          setCourses(data);
        } else {
          // Educator or unauthenticated: show all courses grouped by educator list
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll");
    } finally {
      setEnrolling("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="section">
          <div className="section-header">
            <h2>
              {user?.role === "student" && user.grade
                ? `Courses for ${user.grade} grade`
                : "Explore Courses"}
            </h2>
            <span className="chip">{courses.length} courses</span>
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <div className="grid">
            {courses.map((course) => (
              <div key={course._id} className="card">
                <h4>{course.title}</h4>
                <p>{course.description || "No description"}</p>
                <p className="muted">
                  Grade: {course.grade} | Educator: {course.educator?.name || "N/A"}
                </p>
                <p className="muted">Students: {course.studentsEnrolled}</p>
                {user?.role === "student" && (
                  <button className="btn" disabled={enrolling === course._id} onClick={() => enroll(course._id)}>
                    {enrolling === course._id ? "Enrolling..." : "Enroll"}
                  </button>
                )}

                {course.lessons?.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <button
                      className="btn-secondary"
                      onClick={() => setExpanded((prev) => ({ ...prev, [course._id]: !prev[course._id] }))}
                    >
                      {expanded[course._id] ? "Hide lessons" : "Show lessons"}
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
          </div>

          {courses.length === 0 && !error && <p>No courses available yet.</p>}

          <div className="section">
            <h3>Educators</h3>
            <div className="grid">
              {educators.map((ed) => (
                <div key={ed._id} className="card">
                  <h4>{ed.name}</h4>
                  <p className="muted">{ed.email}</p>
                </div>
              ))}
              {educators.length === 0 && <p className="muted">No educators found.</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

