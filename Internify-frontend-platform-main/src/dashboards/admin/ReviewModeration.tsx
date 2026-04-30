import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { adminService } from '../../services/admin.service';
import type { Review } from '../../types';

export const ReviewModeration: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await adminService.getAllReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      showToast('Error loading reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: 'APPROVED' | 'REJECTED') => {
    setUpdating(id);
    try {
      if (newStatus === 'APPROVED') {
        await adminService.approveReview(id);
      } else {
        await adminService.rejectReview(id);
      }
      
      // Update the local state to reflect the change
      setReviews(prev => prev.map(review => 
        review.id === id ? { ...review, status: newStatus } : review
      ));
      showToast(`Review ${newStatus.toLowerCase()} successfully!`, 'success');
    } catch (error) {
      console.error('Error updating review status:', error);
      showToast('Error updating review status', 'error');
    } finally {
      setUpdating(null);
    }
  };



  const getDisplayName = (user: any) => {
    if (!user) return 'Unknown User';
    
    // For Student entities, use name field
    if (user.name) return user.name;
    
    // For Recruiter entities, use organizationName
    if (user.organizationName) return user.organizationName;
    
    // Fallback to email if available
    if (user.email) return user.email;
    
    // Final fallback
    return `User ${user.id || 'Unknown'}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Moderation</h1>

      <p className="text-gray-600 mb-6">
        Review and moderate user feedback and ratings. Approve or reject reviews to maintain platform quality.
      </p>

      {reviews.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reviews found for moderation</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">({review.rating}/5)</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(review.status)}`}
                  >
                    {review.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span className="font-medium">From:</span> {getDisplayName(review.reviewer)} → {getDisplayName(review.reviewee)}
                  </div>
                  <div>
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </div>
                </div>

                {review.status === 'PENDING' && (
                  <div className="flex items-center space-x-3 pt-4 border-t">
                    <label className="text-sm font-medium text-gray-700">Action:</label>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(review.id, 'APPROVED')}
                      loading={updating === review.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusUpdate(review.id, 'REJECTED')}
                      loading={updating === review.id}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};