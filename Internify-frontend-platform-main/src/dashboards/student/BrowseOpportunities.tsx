import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/student.service';
import { handleApiError } from '../../services/api';
import { Card, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Internship, Freelance } from '../../types';

export const BrowseOpportunities: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [type, setType] = useState<'internships' | 'freelance'>('internships');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [freelance, setFreelance] = useState<Freelance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applying, setApplying] = useState<number | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, [type]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      if (type === 'internships') {
        // GET /api/students/internships
        const data = await studentService.getInternships();
        setInternships(data);
      } else {
        // GET /api/students/freelance
        const data = await studentService.getFreelanceGigs();
        setFreelance(data);
      }
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id: number) => {
    setApplying(id);
    try {
      if (type === 'internships') {
        // POST /api/students/internships/{id}/apply
        await studentService.applyToInternship(id);
      } else {
        // POST /api/students/freelance/{id}/apply
        await studentService.applyToFreelance(id);
      }
      showToast('Application submitted successfully!', 'success');
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setApplying(null);
    }
  };

  const filteredInternships = internships.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFreelance = freelance.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Opportunities</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex space-x-2">
          <Button
            variant={type === 'internships' ? 'primary' : 'secondary'}
            onClick={() => setType('internships')}
          >
            Internships
          </Button>
          <Button
            variant={type === 'freelance' ? 'primary' : 'secondary'}
            onClick={() => setType('freelance')}
          >
            Freelance
          </Button>
        </div>

        <Input
          placeholder="Search by title or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {type === 'internships'
            ? filteredInternships.map((item) => (
                <Card key={item.id} hover>
                  <CardHeader
                    title={item.title}
                    subtitle={item.recruiterOrgName || 'Organization'}
                  />

                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">{item.description}</p>

                    {item.skills && (
                      <div className="flex flex-wrap gap-2">
                        {item.skills.split(',').map((skill, idx) => (
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
                      {item.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {item.duration}
                        </div>
                      )}
                      {item.location && (
                        <div>
                          <span className="font-medium">Location:</span> {item.location}
                        </div>
                      )}
                      {item.stipend && (
                        <div>
                          <span className="font-medium">Stipend:</span> ${item.stipend}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span
                          className={`${
                            item.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {item.postedDate && (
                        <div>
                          <span className="font-medium">Posted:</span> {new Date(item.postedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <Button
                      fullWidth
                      onClick={() => handleApply(item.id)}
                      loading={applying === item.id}
                      disabled={item.status !== 'ACTIVE'}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))
            : filteredFreelance.map((item) => (
                <Card key={item.id} hover>
                  <CardHeader
                    title={item.title}
                    subtitle={item.recruiterOrgName || 'Organization'}
                  />

                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">{item.description}</p>

                    {item.skills && (
                      <div className="flex flex-wrap gap-2">
                        {item.skills.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {item.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {item.duration}
                        </div>
                      )}
                      {item.budget && (
                        <div>
                          <span className="font-medium">Budget:</span> ${item.budget}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span
                          className={`${
                            item.status === 'OPEN' ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {item.postedDate && (
                        <div>
                          <span className="font-medium">Posted:</span> {new Date(item.postedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <Button
                      fullWidth
                      onClick={() => handleApply(item.id)}
                      loading={applying === item.id}
                      disabled={item.status === 'CLOSED'}
                    >
                      {item.status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Apply Now'}
                    </Button>
                  </div>
                </Card>
              ))}
        </div>
      )}

      {!loading &&
        ((type === 'internships' && filteredInternships.length === 0) ||
          (type === 'freelance' && filteredFreelance.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No opportunities found</p>
          </div>
        )}
    </div>
  );
};
