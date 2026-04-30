import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

          <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Email</h2>
                <a
                  href="mailto:support@internify.com"
                  className="text-blue-600 hover:underline"
                >
                  support@internify.com
                </a>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Phone</h2>
                <p className="text-gray-600">+1 234 567 890</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Address</h2>
                <p className="text-gray-600">
                  123 Innovation Drive
                  <br />
                  Tech City, TC 12345
                  <br />
                  India
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
