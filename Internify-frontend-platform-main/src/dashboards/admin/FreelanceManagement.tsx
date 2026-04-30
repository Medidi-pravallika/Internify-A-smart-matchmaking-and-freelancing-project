import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

export const FreelanceManagement: React.FC = () => {
  const { toast, hideToast } = useToast();
  const [freelanceProjects, setFreelanceProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFreelanceProjects();
  }, []);

  const loadFreelanceProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/freelance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFreelanceProjects(data);
      }
    } catch (error) {
      console.error('Error loading freelance projects:', error);
    } finally {
      setLoading(false);
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

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Freelance Project Management</h1>
          <p className="text-gray-600 mt-2">Review and manage all freelance projects</p>
        </div>
      </div>

      {freelanceProjects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No pending freelance projects found</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freelanceProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader
                title={project.title}
                subtitle={project.postedBy?.organizationName || 'Unknown Organization'}
              />

              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{project.description}</p>

                <div className="text-sm">
                  <div className="mb-2">
                    <span className="font-medium">Requirements:</span> {project.requirements || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Status:</span>{' '}
                    <span className="text-yellow-600 capitalize">{project.status}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Posted: {project.postedDate ? new Date(project.postedDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};