import React, { useState } from 'react';
import { recruiterService } from '../../services/recruiter.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Input, TextArea } from '../../components/Input';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

export const PostOpportunity: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [type, setType] = useState<'internship' | 'freelance'>('internship');
  const [loading, setLoading] = useState(false);

  const [internshipData, setInternshipData] = useState({
    title: '',
    description: '',
    requirements: '',
  });

  const [freelanceData, setFreelanceData] = useState({
    title: '',
    description: '',
    requirements: '',
  });

  const [jdFile, setJdFile] = useState<File | null>(null);



  const handleInternshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const internshipRequest = {
        title: internshipData.title,
        description: internshipData.description,
        requirements: internshipData.requirements
      };

      console.log('>>> Internship request:', internshipRequest);

      await recruiterService.createInternship(internshipRequest, jdFile || undefined);
      showToast('Internship posted successfully!', 'success');
      
      setInternshipData({
        title: '',
        description: '',
        requirements: '',
      });
      setJdFile(null);
    } catch (error) {
      console.error('>>> Error posting internship:', error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes('AUTHORIZATION ERROR')) {
        showToast('❌ Your account needs RECRUITER role. Contact backend developer to fix your user permissions.', 'error');
      } else {
        showToast(handleApiError(error), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFreelanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const freelanceRequest = {
        title: freelanceData.title,
        description: freelanceData.description,
        requirements: freelanceData.requirements
      };

      console.log('>>> Freelance request:', freelanceRequest);

      await recruiterService.createFreelance(freelanceRequest);
      showToast('Freelance gig posted successfully!', 'success');
      
      setFreelanceData({
        title: '',
        description: '',
        requirements: '',
      });
    } catch (error) {
      console.error('>>> Error posting freelance:', error);
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Post Opportunity</h1>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={type === 'internship' ? 'primary' : 'secondary'}
          onClick={() => setType('internship')}
        >
          Internship
        </Button>
        <Button
          variant={type === 'freelance' ? 'primary' : 'secondary'}
          onClick={() => setType('freelance')}
        >
          Freelance Gig
        </Button>
      </div>

      <Card>
        {type === 'internship' ? (
          <form onSubmit={handleInternshipSubmit} className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="e.g., Software Development Intern"
              value={internshipData.title}
              onChange={(e) => setInternshipData({ ...internshipData, title: e.target.value })}
              required
            />

            <TextArea
              label="Description"
              placeholder="Describe the internship role, responsibilities, and requirements..."
              value={internshipData.description}
              onChange={(e) => setInternshipData({ ...internshipData, description: e.target.value })}
              rows={5}
              required
            />

            <TextArea
              label="Requirements"
              placeholder="Include all requirements here:
- Duration: e.g., 3 months, 6 months
- Location: e.g., Remote, Mumbai, Hybrid  
- Skills: e.g., JavaScript, React, Node.js
- Stipend: e.g., ₹15,000/month
- Education: e.g., B.Tech, MCA
- Other requirements..."
              value={internshipData.requirements}
              onChange={(e) => setInternshipData({ ...internshipData, requirements: e.target.value })}
              rows={8}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Job Description (optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <Button type="submit" loading={loading}>
              Post Internship
            </Button>
          </form>
        ) : (
          <form onSubmit={handleFreelanceSubmit} className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="e.g., Mobile App Development Project"
              value={freelanceData.title}
              onChange={(e) => setFreelanceData({ ...freelanceData, title: e.target.value })}
              required
            />

            <TextArea
              label="Description"
              placeholder="Describe the project requirements and deliverables..."
              value={freelanceData.description}
              onChange={(e) => setFreelanceData({ ...freelanceData, description: e.target.value })}
              rows={5}
              required
            />

            <TextArea
              label="Requirements"
              placeholder="Include all requirements here:
- Duration: e.g., 2 weeks, 1 month
- Skills: e.g., Flutter, Firebase, UI/UX Design
- Budget: e.g., ₹50,000
- Other requirements..."
              value={freelanceData.requirements}
              onChange={(e) => setFreelanceData({ ...freelanceData, requirements: e.target.value })}
              rows={6}
              required
            />

            <Button type="submit" loading={loading}>
              Post Freelance Gig
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};