import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/student.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Application } from '../../types';

export const MyApplications: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      // GET /api/students/applications - Get internship applications
      const internshipApps = await studentService.getMyApplications();
      
      // GET /api/students/freelance/applications - Get freelance applications
      const freelanceApps = await studentService.getMyFreelanceApplications();
      
      // Combine both types of applications
      const allApplications = [...internshipApps, ...freelanceApps];
      setApplications(allApplications);
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No applications yet</p>
            <p className="text-gray-400 mt-2">Start applying to opportunities!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {(application as any).internship?.title || (application as any).freelance?.title || 'Opportunity'}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>
                      Applied: {new Date((application as any).applicationDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      Type: {(application as any).internship ? 'Internship' : 'Freelance'}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
