import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Rooms from "./pages/Rooms";
import ProtectedRoute from "./Components/ProtectedRoute";
import ManageStudents from "./pages/ManageStudents";
import EntryLogs from "./pages/EntryLogs";
import ManageComplaints from "./pages/ManageComplaints";
import SOSAlerts from "./pages/SOSAlerts";
import RentManagement from "./pages/RentManagement";
import AdminAnalytics from "./pages/AdminAnalytics";
import Register from "./pages/Register";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminManagement from "./pages/AdminManagement";

function App() {
  return (
    <Router>
      <Routes>

        {/* ── Public ───────────────────────────────────────── */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Super Admin ───────────────────────────────────── */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/admins"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-admins"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <AdminManagement />
            </ProtectedRoute>
          }
        />

        {/* ── Admin ─────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <ManageStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <EntryLogs />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><ManageComplaints /></ProtectedRoute>} />
        <Route path="/admin/sos"        element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><SOSAlerts /></ProtectedRoute>} />
        <Route path="/admin/rent"       element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><RentManagement /></ProtectedRoute>} />
        <Route path="/admin/analytics"  element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><AdminAnalytics /></ProtectedRoute>} />

        {/* ── Student ───────────────────────────────────────── */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;