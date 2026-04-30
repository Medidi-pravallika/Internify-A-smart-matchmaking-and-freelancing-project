import React, { useState } from 'react';
import { recruiterService } from '../../services/recruiter.service';
import { handleApiError } from '../../services/api';
import { Card, CardHeader } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Student } from '../../types';

export const MLMatching: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [matchedStudents, setMatchedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [jdFile, setJdFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!jdFile) {
      showToast('Please select a job description file', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await recruiterService.getMatchedStudents(jdFile);
      setMatchedStudents(data);
      showToast('Student matches generated successfully!', 'success');
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (studentId: number, action: 'accept' | 'reject') => {
    try {
      // Find the student to get their application ID
      const student = matchedStudents.find(s => s.id === studentId);
      if (!student?.applicationId) {
        showToast('Application ID not found', 'error');
        return;
      }

      await recruiterService.updateApplicationStatus(student.applicationId, action);
      showToast(`Application ${action}ed successfully!`, 'success');
      
      // Update the student list to show the action has been taken
      setMatchedStudents(prev => prev.map(s => 
        s.id === studentId 
          ? { ...s, applicationStatus: action } 
          : s
      ));
    } catch (error) {
      showToast(handleApiError(error), 'error');
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">ML Resume Matching</h1>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Job Description</h2>
        <p className="text-gray-600 mb-4">
          Upload a job description and our ML will find the best matching students based on
          their skills and experience.
        </p>

        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setJdFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />

          <Button onClick={handleUpload} loading={loading}>
            Find Matching Students
          </Button>
        </div>
      </Card>

      {matchedStudents.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Top Matched Students ({matchedStudents.length})
          </h2>
          <p className="text-gray-600 mb-6">
            Students are ranked by ML match score based on skills and experience alignment with your job description.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedStudents.map((student) => (
              <Card key={student.id} hover>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardHeader title={student.name} subtitle={student.email} />

                    <div className="space-y-3">
                      {student.skills && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {student.skills.split(',').map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Member since:</span>{' '}
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end space-y-2">
                    {student.matchScore && student.matchScore > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                        student.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Match: {student.matchScore.toFixed(1)}%
                      </span>
                    )}
                    
                    <div className="flex space-x-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => handleApplicationAction(student.id, 'accept')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApplicationAction(student.id, 'reject')}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Show message when no matches found
        jdFile && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Matches Found</h3>
            <p className="text-gray-500">
              Try uploading a different job description or check back later as new students join the platform.
            </p>
          </div>
        )
      )}
    </div>
  );
};
