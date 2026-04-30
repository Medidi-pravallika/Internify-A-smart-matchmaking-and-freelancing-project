import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Smart Matchmaking Platform for
                <br />
                <span className="text-blue-600">Internships & Freelance Projects</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect talented students with top companies. Find the perfect match using
                our ML-powered recommendation system.
              </p>

              <div className="flex justify-center space-x-4">
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Get Started
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Why Choose Internify?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-semibold mb-4">Smart Matching</h3>
                <p className="text-gray-600">
                  ML-powered algorithm matches students with opportunities based on skills
                  and experience.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-semibold mb-4">Fast & Easy</h3>
                <p className="text-gray-600">
                  Simple application process. Apply to multiple opportunities with just a
                  few clicks.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-2xl font-semibold mb-4">Trusted Platform</h3>
                <p className="text-gray-600">
                  Verified companies and quality opportunities. Build your career with
                  confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students and companies already on Internify
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
              Sign Up Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
