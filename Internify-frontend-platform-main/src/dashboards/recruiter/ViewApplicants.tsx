import React, { useState, useEffect } from 'react';
import { recruiterService } from '../../services/recruiter.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Select } from '../../components/Input';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Internship, Freelance, Application } from '../../types';

export const ViewApplicants: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [type, setType] = useState<'internships' | 'freelance'>('internships');
  const [opportunities, setOpportunities] = useState<Internship[] | Freelance[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, [type]);

  const loadOpportunities = async () => {
    try {
      if (type === 'internships') {
        const data = await recruiterService.getInternships();
        setOpportunities(data);
      } else {
        const data = await recruiterService.getFreelance();
        setOpportunities(data);
      }
    } catch (error) {
      showToast(handleApiError(error), 'error');
    }
  };

  const loadApplicants = async (id: number) => {
    setLoading(true);
    try {
      let data: Application[];
      if (type === 'internships') {
        data = await recruiterService.getInternshipApplications(id);
      } else {
        data = await recruiterService.getFreelanceApplications(id);
      }
      setApplicants(data);
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, status: string) => {
    setUpdating(applicationId);
    try {
      if (type === 'internships') {
        // PUT /api/recruiters/applications/{id}/status
        await recruiterService.updateApplicationStatus(applicationId, status);
      } else {
        // PUT /api/recruiters/freelance/applications/{id}/status
        await recruiterService.updateFreelanceApplicationStatus(applicationId, status);
      }
      showToast(`Application ${status.toLowerCase()} successfully!`, 'success');
      if (selectedId) {
        loadApplicants(parseInt(selectedId));
      }
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedId(value);
    if (value) {
      loadApplicants(parseInt(value));
    } else {
      setApplicants([]);
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">View Applicants</h1>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={type === 'internships' ? 'primary' : 'secondary'}
              onClick={() => {
                setType('internships');
                setSelectedId('');
                setApplicants([]);
              }}
            >
              Internships
            </Button>
            <Button
              variant={type === 'freelance' ? 'primary' : 'secondary'}
              onClick={() => {
                setType('freelance');
                setSelectedId('');
                setApplicants([]);
              }}
            >
              Freelance
            </Button>
          </div>

          <Select
            label="Select Opportunity"
            value={selectedId}
            onChange={(e) => handleSelectChange(e.target.value)}
            options={[
              { value: '', label: 'Choose an opportunity...' },
              ...opportunities.map((opp) => ({
                value: opp.id.toString(),
                label: opp.title,
              })),
            ]}
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : applicants.length > 0 ? (
        <div className="space-y-4">
          {applicants.map((application) => (
            <Card key={application.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {((application as any).studentName || 'Student').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {(application as any).studentName || `Student #${(application as any).studentId}`}
                      </h3>
                      {(application as any).studentEmail && (
                        <p className="text-gray-600 text-sm">{(application as any).studentEmail}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>
                      📅 Applied: {new Date((application as any).applicationDate || application.appliedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span
                      className={`font-medium px-2 py-1 rounded-full text-xs ${
                        application.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : application.status === 'APPLIED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {(application as any).studentSkills && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {(application as any).studentSkills.split(',').slice(0, 3).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                        {(application as any).studentSkills.split(',').length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                            +{(application as any).studentSkills.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={application.status === 'ACCEPTED' ? 'success' : 'secondary'}
                    onClick={() => handleStatusChange(application.id, 'ACCEPTED')}
                    loading={updating === application.id}
                    disabled={application.status === 'ACCEPTED'}
                  >
                    {application.status === 'ACCEPTED' ? 'Accepted' : 'Accept'}
                  </Button>
                  <Button
                    size="sm"
                    variant={application.status === 'REJECTED' ? 'danger' : 'secondary'}
                    onClick={() => handleStatusChange(application.id, 'REJECTED')}
                    loading={updating === application.id}
                    disabled={application.status === 'REJECTED'}
                  >
                    {application.status === 'REJECTED' ? 'Rejected' : 'Reject'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : selectedId ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No applicants yet</p>
          </div>
        </Card>
      ) : null}
    </div>
  );
};
