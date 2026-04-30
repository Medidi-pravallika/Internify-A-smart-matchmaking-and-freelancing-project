import React, { useState } from 'react';
import { studentService } from '../../services/student.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

interface RecommendationItem {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  matchScore: number | null;
}

export const Recommendations: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [recommendations, setRecommendations] = useState<{
    internships: RecommendationItem[];
    freelance: RecommendationItem[];
  }>({ internships: [], freelance: [] });
  const [matchResult, setMatchResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Helper function to format match score properly
  const formatMatchScore = (score: number | null): number => {
    if (!score) return 0;
    
    // If score is already in percentage format (> 1), just round it
    if (score > 1) {
      return Math.round(score);
    }
    
    // If score is in decimal format (0-1), convert to percentage
    return Math.round(score * 100);
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      showToast('Please select a resume file', 'error');
      return;
    }

    setLoading(true);
    try {
      // Use enhanced endpoint that returns opportunities with match scores
      const data = await studentService.getRecommendationsWithScores(resumeFile);
      console.log(">>> Frontend received recommendations data:", data);
      setRecommendations(data);

      // Also get legacy string response for backward compatibility
      try {
        const legacyData = await studentService.getRecommendations(resumeFile);
        setMatchResult(legacyData);
      } catch (legacyError) {
        console.warn('Legacy endpoint failed, but enhanced endpoint succeeded');
      }

      showToast('ML recommendations generated successfully!', 'success');
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">ML Recommendations</h1>

      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Resume for Smart Matching</h2>
        <p className="text-gray-600 mb-4">
          Upload your resume and our ML system will recommend the best internship opportunities
          based on your skills and experience.
        </p>

        <div className="space-y-4">
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

          <Button onClick={handleUpload} loading={loading}>
            Get Recommendations
          </Button>
        </div>
      </Card>

      {(recommendations.internships.length > 0 || recommendations.freelance.length > 0) && (
        <Card className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🤖 ML Matching Results
          </h2>

          {/* Internships Section */}
          {recommendations.internships.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎓 Internship Recommendations</h3>
              <div className="space-y-4">
                {recommendations.internships.map((item) => {
                  console.log(">>> Rendering internship item:", item);
                  return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            formatMatchScore(item.matchScore) >= 80 ? 'bg-green-100 text-green-800' :
                            formatMatchScore(item.matchScore) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Match: {formatMatchScore(item.matchScore)}%
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/student/browse`}
                        className="ml-4"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Freelance Section */}
          {recommendations.freelance.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💼 Freelance Recommendations</h3>
              <div className="space-y-4">
                {recommendations.freelance.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            formatMatchScore(item.matchScore) >= 80 ? 'bg-green-100 text-green-800' :
                            formatMatchScore(item.matchScore) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Match: {formatMatchScore(item.matchScore)}%
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/student/browse`}
                        className="ml-4"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-600 mt-6 text-sm bg-gray-50 p-4 rounded-lg">
            💡 Our ML system has analyzed your resume and ranked these opportunities based on skill matching.
            Higher match scores indicate better fit for your profile!
          </p>
        </Card>
      )}

      {/* Legacy string response fallback */}
      {matchResult && (recommendations.internships.length === 0 && recommendations.freelance.length === 0) && (
        <Card className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🤖 ML Matching Results
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
              {matchResult}
            </pre>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            💡 Visit the Browse Opportunities page to apply to these matches!
          </p>
        </Card>
      )}
    </div>
  );
};
