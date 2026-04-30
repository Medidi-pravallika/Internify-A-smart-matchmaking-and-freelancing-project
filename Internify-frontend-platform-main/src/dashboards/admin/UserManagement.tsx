import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../components/Toast';

interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  orgName?: string;
}

export const UserManagement: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        showToast('Failed to load users', 'error');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.orgName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

      <Card className="mb-6">
        <Input
          placeholder="Search by email, name, or organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No users found matching your search' : 'No users found'}
              </p>
            </div>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.name || user.orgName || 'User'}
                    </h3>
                    {user.role === 'STUDENT' && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Student
                      </span>
                    )}
                    {user.role === 'RECRUITER' && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Recruiter
                      </span>
                    )}
                    {user.role === 'ADMIN' && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">User ID: {user.id}</p>
                  {user.orgName && (
                    <p className="text-sm text-gray-500">Organization: {user.orgName}</p>
                  )}
                  <div className="mt-2">
                    {user.role === 'STUDENT' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        User Type: Student
                      </span>
                    )}
                    {user.role === 'RECRUITER' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        User Type: Recruiter
                      </span>
                    )}
                    {user.role === 'ADMIN' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        User Type: Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};