import React, { useState, useEffect } from 'react';
import { recruiterService } from '../../services/recruiter.service';
import { handleApiError } from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Select } from '../../components/Input';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import type { Internship, Freelance } from '../../types';

export const ManageOpportunities: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [type, setType] = useState<'internships' | 'freelance'>('internships');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [freelance, setFreelance] = useState<Freelance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Internship | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOpportunities();
  }, [type]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      if (type === 'internships') {
        const data = await recruiterService.getInternships();
        setInternships(data);
      } else {
        const data = await recruiterService.getFreelance();
        setFreelance(data);
      }
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedItem || !newStatus) return;

    setUpdating(true);
    try {
      if (type === 'internships') {
        // PUT /api/recruiters/internships/{id}/status
        await recruiterService.updateInternshipStatus(selectedItem.id, newStatus);
      } else {
        // PUT /api/recruiters/freelance/{id}/status
        await recruiterService.updateFreelanceStatus(selectedItem.id, newStatus);
      }
      showToast('Status updated successfully!', 'success');
      setShowStatusModal(false);
      loadOpportunities();
    } catch (error) {
      showToast(handleApiError(error), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    console.log(`>>> Attempting to delete ${type} with ID:`, id);
    
    try {
      if (type === 'internships') {
        console.log('>>> Calling deleteInternship service');
        await recruiterService.deleteInternship(id);
      } else {
        console.log('>>> Calling deleteFreelance service');
        await recruiterService.deleteFreelance(id);
      }
      showToast('Opportunity deleted successfully!', 'success');
      loadOpportunities();
    } catch (error) {
      console.error('>>> Delete operation failed:', error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes('Authentication failed')) {
        showToast('❌ Authentication failed. Please logout and login again as a RECRUITER.', 'error');
      } else if (errorMessage.includes('login again')) {
        showToast('❌ Session expired. Please login again.', 'error');
      } else {
        showToast(handleApiError(error), 'error');
      }
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Opportunities</h1>

      <div className="flex space-x-2 mb-6">
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {type === 'internships'
            ? internships.map((item) => (
                <Card key={item.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                      <div className="grid grid-cols-1 gap-4 text-sm">
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
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setNewStatus(item.status);
                          setShowStatusModal(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            : freelance.map((item) => (
                <Card key={item.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                      <div className="grid grid-cols-1 gap-4 text-sm">
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
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setNewStatus(item.status);
                          setShowStatusModal(true);
                        }}
                      >
                        Update Status
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      )}

      {!loading &&
        ((type === 'internships' && internships.length === 0) ||
          (type === 'freelance' && freelance.length === 0)) && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No opportunities posted yet</p>
            </div>
          </Card>
        )}

      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Status"
      >
        <div className="space-y-4">
          <Select
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={
              type === 'internships'
                ? [
                    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'CLOSED', label: 'Closed' },
                  ]
                : [
                    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
                    { value: 'OPEN', label: 'Open' },
                    { value: 'CLOSED', label: 'Closed' },
                  ]
            }
          />

          <div className="flex space-x-4">
            <Button onClick={handleUpdateStatus} loading={updating}>
              Update
            </Button>
            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
