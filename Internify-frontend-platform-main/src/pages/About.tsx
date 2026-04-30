import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Internify</h1>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Internify is dedicated to bridging the gap between talented students and top
              companies. We use ML technology to match candidates with the perfect
              opportunities based on their skills, experience, and career goals.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Smart ML-powered matching for internships and freelance projects</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Easy application process for students</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Efficient hiring tools for recruiters</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Verified companies and quality opportunities</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Have questions? Reach out to us at{' '}
              <a href="mailto:support@internify.com" className="text-blue-600 hover:underline">
                support@internify.com
              </a>
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
