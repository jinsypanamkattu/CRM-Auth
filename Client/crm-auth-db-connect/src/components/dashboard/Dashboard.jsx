import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

import '../../css/Dashboard.css';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const { token, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCustomers();
    }
  }, [token]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/customers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      
          <div className="flex justify-between h-16 items-center" >
            <div className="dsh-board text-xl font-bold text-gray-900">CRM Dashboard</div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
       

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Customers</h3>
            <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
          </div>
          {/* Add more stat cards as needed */}
        </div>

        {/* Customers List */}
        <div className="check bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="cust-title text-lg font-medium text-gray-900">Customer Details</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading customers...</div>
            ) : customers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No customers found</div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        <p>{customer.email}</p>
                        {customer.phone && <p>{customer.phone}</p>}
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;