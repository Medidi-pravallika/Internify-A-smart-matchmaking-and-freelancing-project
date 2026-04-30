import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { handleApiError } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      console.log('Login response:', response); // Debug log
      showToast('Login successful!', 'success');

      // Immediate redirect based on role
      setTimeout(() => {
        const role = response.role;
        console.log('Redirecting user with role:', role); // Debug log
        
        if (role === 'STUDENT') {
          navigate('/dashboard/student/profile');
        } else if (role === 'RECRUITER') {
          navigate('/dashboard/recruiter/profile');
        } else if (role === 'ADMIN') {
          navigate('/dashboard/admin/analytics');
        } else {
          console.error('Unknown role:', role);
          showToast('Unknown user role. Please contact support.', 'error');
        }
      }, 500);
    } catch (error) {
      console.error('Login error:', error); // Debug log
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
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
