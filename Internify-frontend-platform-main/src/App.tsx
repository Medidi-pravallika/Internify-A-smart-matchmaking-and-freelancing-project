import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { StudentDashboard } from './dashboards/student/StudentDashboard';
import { RecruiterDashboard } from './dashboards/recruiter/RecruiterDashboard';
import { AdminDashboard } from './dashboards/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/dashboard/student/*"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/recruiter/*"
          element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
