import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { UserManagement } from './UserManagement';
import { InternshipManagement } from './InternshipManagement';
import { FreelanceManagement } from './FreelanceManagement';
import { ReviewModeration } from './ReviewModeration';
import { Analytics } from './Analytics';

const sidebarItems = [
  { label: 'User Management', path: '/dashboard/admin/users', icon: '👥' },
  { label: 'Internship Management', path: '/dashboard/admin/internships', icon: '📋' },
  { label: 'Freelance Management', path: '/dashboard/admin/freelance', icon: '💼' },
  { label: 'Review Moderation', path: '/dashboard/admin/reviews', icon: '⚖️' },
  { label: 'Analytics', path: '/dashboard/admin/analytics', icon: '📊' },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated />

      <div className="flex flex-1">
        <Sidebar items={sidebarItems} />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="users" element={<UserManagement />} />
            <Route path="internships" element={<InternshipManagement />} />
            <Route path="freelance" element={<FreelanceManagement />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
