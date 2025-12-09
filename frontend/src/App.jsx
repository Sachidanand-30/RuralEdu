import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/authpage";
import { DashboardPage } from "./pages/dashboard";
import { CoursesPage } from "./pages/courses";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["student"]} />}>
        <Route path="/dashboard/student" element={<DashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["educator"]} />}>
        <Route path="/dashboard/teacher" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
