import React, { useState } from 'react';
import { recruiterService } from '../../services/recruiter.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Input, TextArea } from '../../components/Input';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

export const RecruiterReview: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reviewedUserId: '',
    rating: '1',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reviewedUserId || !formData.comment) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    console.log('>>> RecruiterReview - Form data:', formData);
    console.log('>>> Current user role:', localStorage.getItem('role'));
    console.log('>>> Current token:', localStorage.getItem('token') ? 'Token exists' : 'No token');

    setLoading(true);
    try {
      console.log('>>> About to submit - reviewedUserId:', formData.reviewedUserId, 'rating:', formData.rating, 'comment:', formData.comment);
      console.log('>>> Parsed values - reviewedUserId:', parseInt(formData.reviewedUserId), 'rating:', parseInt(formData.rating));
      
      await recruiterService.submitReview(
        parseInt(formData.reviewedUserId),
        parseInt(formData.rating),
        formData.comment
      );
      showToast('Review submitted successfully!', 'success');
      setFormData({ reviewedUserId: '', rating: '1', comment: '' });
    } catch (error) {
      console.error('>>> RecruiterReview - Error:', error);
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Review</h1>

      <Card>
        <p className="text-gray-600 mb-6">
          Share your experience working with a student. Your feedback helps students improve
          and assists other recruiters in their hiring decisions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Student User ID"
            type="number"
            placeholder="Enter the user ID of the student"
            value={formData.reviewedUserId}
            onChange={(e) => setFormData({ ...formData, reviewedUserId: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5 stars)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => {
                    console.log('>>> Star clicked:', rating);
                    setFormData({ ...formData, rating: rating.toString() });
                    console.log('>>> Rating updated to:', rating.toString());
                  }}
                  className={`text-4xl font-bold transition-all duration-200 transform hover:scale-110 ${
                    parseInt(formData.rating) >= rating
                      ? 'text-yellow-500 hover:text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  {parseInt(formData.rating) >= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click on the stars to rate (Current: {formData.rating} star{formData.rating !== '1' ? 's' : ''})
            </p>
          </div>

          <TextArea
            label="Your Review"
            placeholder="Share your experience working with this student..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={6}
            required
          />

          <Button type="submit" loading={loading}>
            Submit Review
          </Button>
        </form>
      </Card>
    </div>
  );
};
