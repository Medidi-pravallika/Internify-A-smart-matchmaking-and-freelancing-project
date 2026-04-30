import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

export const InternshipManagement: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/internships', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInternships(data);
      }
    } catch (error) {
      console.error('Error loading internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setCreating(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/sample-data/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showToast('Sample data created successfully!', 'success');
        loadInternships();
      }
    } catch (error) {
      showToast('Error creating sample data', 'error');
    } finally {
      setCreating(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Internship Management</h1>
          <p className="text-gray-600 mt-2">Review and manage all internships</p>
        </div>
        {internships.length === 0 && (
          <Button
            onClick={createSampleData}
            loading={creating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {creating ? 'Creating...' : 'Create Sample Data'}
          </Button>
        )}
      </div>

      {internships.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No pending internships found</p>
            <p className="text-gray-400 text-sm">Click "Create Sample Data" to add sample internships for testing</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <Card key={internship.id}>
              <CardHeader
                title={internship.title}
                subtitle={internship.recruiterOrgName || 'Unknown Organization'}
              />

              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{internship.description}</p>

                {internship.skills && (
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.split(',').map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {internship.stipend && (
                    <div>
                      <span className="font-medium">Stipend:</span> {internship.stipend}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <span className="text-yellow-600 capitalize">{internship.status}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Posted: {internship.createdAt ? new Date(internship.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
