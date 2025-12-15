import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Navbar } from "../components/Navbar";
import { getYoutubeEmbedUrl } from "../lib/youtube";
import { ArrowLeft, BookOpen, User, PlayCircle, Loader2, Clock, Calendar } from "lucide-react";

export const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`);
                setCourse(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load course details");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
                        {error || "Course not found"}
                    </div>
                    <button
                        onClick={() => navigate("/courses")}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                </div>
                <div className="relative max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate("/courses")}
                        className="mb-6 flex items-center text-indigo-200 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </button>

                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-4 text-indigo-200 text-sm font-medium">
                            <span className="px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700">
                                Grade {course.grade}
                            </span>
                            <span className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1.5" />
                                {course.lessons?.length || 0} Lessons
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold mb-6 tracking-tight">{course.title}</h1>
                        <p className="text-lg text-indigo-100 leading-relaxed mb-8">
                            {course.description || "No description provided."}
                        </p>

                        <div className="flex items-center gap-4 pt-6 border-t border-indigo-800/50">
                            <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center">
                                <User className="w-5 h-5 text-indigo-200" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{course.educator?.name || "Unknown Educator"}</p>
                                <p className="text-xs text-indigo-300">Course Instructor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Lessons List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                            <PlayCircle className="w-6 h-6 mr-3 text-indigo-600" />
                            Course Content
                        </h2>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {course.lessons?.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {course.lessons.map((lesson, idx) => {
                                        const embedUrl = getYoutubeEmbedUrl(lesson.youtubeUrl);
                                        return (
                                            <div key={lesson._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-medium text-slate-900 mb-3">
                                                            {lesson.title}
                                                        </h3>

                                                        {embedUrl ? (
                                                            <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                                                                <iframe
                                                                    src={embedUrl}
                                                                    title={lesson.title}
                                                                    className="absolute inset-0 w-full h-full"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                                                                Video unavailable
                                                            </div>
                                                        )}

                                                        {lesson.description && (
                                                            <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                                                                {lesson.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-slate-500">
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                    <p>No lessons available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Course Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-sm text-slate-600">
                                    <BookOpen className="w-4 h-4 mr-3 text-slate-400" />
                                    <span>{course.lessons?.length || 0} Lessons</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <User className="w-4 h-4 mr-3 text-slate-400" />
                                    <span>{course.studentsEnrolled || 0} Students Enrolled</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 mr-3 text-slate-400" />
                                    <span>Last Updated: {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                            <h3 className="font-semibold text-indigo-900 mb-2">Need Help?</h3>
                            <p className="text-sm text-indigo-700 mb-4">
                                Contact your educator if you have questions about the course material.
                            </p>
                            <a
                                href={`mailto:${course.educator?.email}`}
                                className="block w-full text-center py-2 px-4 bg-white text-indigo-600 rounded-lg border border-indigo-200 text-sm font-medium hover:bg-indigo-50 transition-colors"
                            >
                                Contact Educator
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
