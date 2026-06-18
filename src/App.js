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
// import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
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
        <Route path="/admin/sos" element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><SOSAlerts /></ProtectedRoute>} />
        <Route path="/admin/rent" element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><RentManagement /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]}><AdminAnalytics /></ProtectedRoute>} />
<Route path="/register" element={<Register />} />
{/* <Route path="/" element={<AuthPage />} /> */}

      </Routes>
    </Router>
  );
}

export default App;