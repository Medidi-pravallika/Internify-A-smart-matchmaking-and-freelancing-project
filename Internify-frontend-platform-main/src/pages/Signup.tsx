import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { handleApiError } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [userType, setUserType] = useState<'STUDENT' | 'RECRUITER'>('STUDENT');
  const [loading, setLoading] = useState(false);

  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [recruiterData, setRecruiterData] = useState({
    organizationName: '',
    organizationType: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (studentData.password !== studentData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.registerStudent(studentData.name, studentData.email, studentData.password);
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (recruiterData.password !== recruiterData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.registerRecruiter(
        recruiterData.organizationName,
        recruiterData.organizationType,
        recruiterData.email,
        recruiterData.password
      );
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center text-6xl">🎓</div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant={userType === 'STUDENT' ? 'primary' : 'secondary'}
              onClick={() => setUserType('STUDENT')}
            >
              Student
            </Button>
            <Button
              variant={userType === 'RECRUITER' ? 'primary' : 'secondary'}
              onClick={() => setUserType('RECRUITER')}
            >
              Recruiter
            </Button>
          </div>

          {userType === 'STUDENT' ? (
            <form className="mt-8 space-y-4" onSubmit={handleStudentSubmit}>
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                value={studentData.name}
                onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={studentData.email}
                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={studentData.password}
                onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={studentData.confirmPassword}
                onChange={(e) => setStudentData({ ...studentData, confirmPassword: e.target.value })}
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Sign Up as Student
              </Button>
            </form>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleRecruiterSubmit}>
              <Input
                label="Organization Name"
                type="text"
                placeholder="Enter organization name"
                value={recruiterData.organizationName}
                onChange={(e) => setRecruiterData({ ...recruiterData, organizationName: e.target.value })}
                required
              />

              <Select
                label="Organization Type"
                value={recruiterData.organizationType}
                onChange={(e) => setRecruiterData({ ...recruiterData, organizationType: e.target.value })}
                options={[
                  { value: '', label: 'Select type' },
                  { value: 'STARTUP', label: 'Startup' },
                  { value: 'CORPORATE', label: 'Corporate' },
                  { value: 'NGO', label: 'NGO' },
                  { value: 'GOVERNMENT', label: 'Government' },
                ]}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={recruiterData.email}
                onChange={(e) => setRecruiterData({ ...recruiterData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                value={recruiterData.password}
                onChange={(e) => setRecruiterData({ ...recruiterData, password: e.target.value })}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={recruiterData.confirmPassword}
                onChange={(e) => setRecruiterData({ ...recruiterData, confirmPassword: e.target.value })}
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Sign Up as Recruiter
              </Button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
