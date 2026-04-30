import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';
import { adminService } from '../../services/admin.service';

export const Analytics: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInternships: 0,
    totalApplications: 0,
    successRate: 0,
    pendingInternships: 0,
    totalFreelanceProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get main analytics data from backend
      const analyticsData = await adminService.getAnalytics();
      
      // Get additional data for more detailed analytics
      const token = localStorage.getItem('token');
      
      // Load pending internships count
      const pendingInternshipsResponse = await fetch('http://localhost:8080/api/admin/internships/pending', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      // Load total freelance projects count  
      const freelanceResponse = await fetch('http://localhost:8080/api/admin/freelance', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      let pendingInternships = 0;
      let totalFreelanceProjects = 0;

      if (pendingInternshipsResponse.ok) {
        const pendingData = await pendingInternshipsResponse.json();
        pendingInternships = pendingData.length;
      }

      if (freelanceResponse.ok) {
        const freelanceData = await freelanceResponse.json();
        totalFreelanceProjects = freelanceData.length;
      }

      setAnalytics({
        totalUsers: analyticsData.totalUsers,
        totalInternships: analyticsData.totalInternships,
        totalApplications: analyticsData.totalApplications,
        successRate: analyticsData.successRate,
        pendingInternships: pendingInternships,
        totalFreelanceProjects: totalFreelanceProjects,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      showToast('Error loading analytics', 'error');
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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.totalUsers}
            </h3>
            <p className="text-gray-600">Total Users</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">💼</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.totalInternships}
            </h3>
            <p className="text-gray-600">Total Internships</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">💻</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.totalFreelanceProjects}
            </h3>
            <p className="text-gray-600">Freelance Projects</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.totalApplications}
            </h3>
            <p className="text-gray-600">Total Applications</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">⏳</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.pendingInternships}
            </h3>
            <p className="text-gray-600">Pending Internships</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {analytics.successRate.toFixed(1)}%
            </h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700">Average applications per opportunity</span>
            <span className="font-semibold">
              {(analytics.totalInternships + analytics.totalFreelanceProjects) > 0
                ? (analytics.totalApplications / (analytics.totalInternships + analytics.totalFreelanceProjects)).toFixed(1)
                : '0'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700">Application success rate</span>
            <span className="font-semibold text-green-600">
              {analytics.successRate.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-700">Pending approvals</span>
            <span className="font-semibold">
              {analytics.pendingInternships} internships
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-700">Platform status</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Operational
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
