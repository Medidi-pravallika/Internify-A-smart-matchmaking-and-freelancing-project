import React, { useState, useEffect } from 'react';
import { recruiterService } from '../../services/recruiter.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Input, Select } from '../../components/Input';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Recruiter } from '../../types';

export const RecruiterProfile: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await recruiterService.getProfile();
      setProfile(data);
      setFormData({
        orgName: data.orgName,
        orgType: data.orgType,
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
      await recruiterService.updateProfile(formData);
      showToast('Profile updated successfully!', 'success');
      loadProfile();
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
            label="Organization Name"
            type="text"
            value={formData.orgName}
            onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
            required
          />

          <Select
            label="Organization Type"
            value={formData.orgType}
            onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
            options={[
              { value: 'STARTUP', label: 'Startup' },
              { value: 'CORPORATE', label: 'Corporate' },
              { value: 'NGO', label: 'NGO' },
              { value: 'GOVERNMENT', label: 'Government' },
            ]}
            required
          />

          <div className="text-sm text-gray-600">
            <p>Member since: {new Date(profile?.createdAt || '').toLocaleDateString()}</p>
          </div>

          <Button type="submit" loading={updating}>
            Update Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};
