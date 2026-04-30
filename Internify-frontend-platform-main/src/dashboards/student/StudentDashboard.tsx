import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { StudentProfile } from './StudentProfile';
import { BrowseOpportunities } from './BrowseOpportunities';
import { MyApplications } from './MyApplications';
import { Recommendations } from './Recommendations';
import { SubmitReview } from './SubmitReview';

const sidebarItems = [
  { label: 'Profile', path: '/dashboard/student/profile', icon: '👤' },
  { label: 'Browse Opportunities', path: '/dashboard/student/browse', icon: '🔍' },
  { label: 'My Applications', path: '/dashboard/student/applications', icon: '📝' },
  { label: 'Recommendations', path: '/dashboard/student/recommendations', icon: '⭐' },
  { label: 'Submit Review', path: '/dashboard/student/review', icon: '✍️' },
];

export const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated />

      <div className="flex flex-1">
        <Sidebar items={sidebarItems} />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="profile" element={<StudentProfile />} />
            <Route path="browse" element={<BrowseOpportunities />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="review" element={<SubmitReview />} />
            <Route path="*" element={<StudentProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
