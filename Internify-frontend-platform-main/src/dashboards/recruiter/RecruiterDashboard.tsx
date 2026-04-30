import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { RecruiterProfile } from './RecruiterProfile';
import { PostOpportunity } from './PostOpportunity';
import { ManageOpportunities } from './ManageOpportunities';
import { ViewApplicants } from './ViewApplicants';
import { MLMatching } from './MLMatching';
import { RecruiterReview } from './RecruiterReview';

const sidebarItems = [
  { label: 'Profile', path: '/dashboard/recruiter/profile', icon: '👤' },
  { label: 'Post Opportunity', path: '/dashboard/recruiter/post', icon: '➕' },
  { label: 'Manage Opportunities', path: '/dashboard/recruiter/manage', icon: '📋' },
  { label: 'View Applicants', path: '/dashboard/recruiter/applicants', icon: '👥' },
  { label: 'ML Resume Matching', path: '/dashboard/recruiter/ml-matching', icon: '🤖' },
  { label: 'Submit Review', path: '/dashboard/recruiter/review', icon: '✍️' },
];

export const RecruiterDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated />

      <div className="flex flex-1">
        <Sidebar items={sidebarItems} />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="post" element={<PostOpportunity />} />
            <Route path="manage" element={<ManageOpportunities />} />
            <Route path="applicants" element={<ViewApplicants />} />
            <Route path="ml-matching" element={<MLMatching />} />
            <Route path="review" element={<RecruiterReview />} />
            <Route path="*" element={<RecruiterProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
