import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, School, BookOpen, Users, ArrowRight, PlayCircle } from "lucide-react";

export const HomePage = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "educator" ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-8 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Revolutionizing Rural Education
            </div>

            <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Quality Education <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Without Barriers
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with expert educators, access world-class resources, and bridge the gap between rural potential and global opportunity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to={dashboardPath}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    Start Learning Now <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/courses"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={20} /> Browse Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={Users} label="Active Students" value="10,000+" />
            <StatCard icon={School} label="Partner Schools" value="500+" />
            <StatCard icon={BookOpen} label="Video Lessons" value="25,000+" />
            <StatCard icon={GraduationCap} label="Success Stories" value="98%" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose RuralEdu?</h2>
            <p className="text-lg text-slate-600">
              We provide tools designed specifically to overcome the challenges of remote learning in rural areas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              title="Accessible Everywhere"
              description="Low-bandwidth optimized content ensures learning never stops, even with slow internet connections."
            />
            <FeatureCard
              icon={Users}
              title="Expert Mentorship"
              description="Direct access to qualified educators who care about your growth and academic success."
            />
            <FeatureCard
              icon={GraduationCap}
              title="Structured Path"
              description="Curriculum aligned with national standards to ensure you remain competitive."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
      <Icon size={24} />
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);

