import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/student.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Input, TextArea } from '../../components/Input';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Student } from '../../types';

export const StudentProfile: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        skills: data.skills || '',
      });
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // PUT /api/students/me with profile data and optional resume
      await studentService.updateProfile(formData, resumeFile || undefined);

      showToast('Profile updated successfully!', 'success');
      await loadProfile();
      setResumeFile(null); // Clear file input
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <Card>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium">{profile?.email}</p>
          </div>

          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <TextArea
            label="Skills (comma separated)"
            placeholder="e.g., JavaScript, React, Python, Machine Learning"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {profile?.resume && (
              <p className="mt-2 text-sm text-gray-600">
                Current resume: {profile.resume}
              </p>
            )}
          </div>

          <Button type="submit" loading={updating}>
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};
