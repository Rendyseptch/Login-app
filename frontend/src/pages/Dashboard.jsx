import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import DarkModeToggle from '../components/DarkModeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';


import {
  FaCalendarAlt,
  FaShieldAlt,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaSyncAlt,
  FaClipboard,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { HiOutlineUserCircle } from 'react-icons/hi';

const Dashboard = () => {
  const { user, logout, darkMode } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const stats = [
    {
      title: 'Account Age',
      value: user?.createdAt
        ? `${Math.floor(
            (new Date() - new Date(user.createdAt)) /
              (1000 * 60 * 60 * 24)
          )} days`
        : 'New',
      icon: <FaCalendarAlt className="text-blue-500 text-xl" />,
    },
    {
      title: 'Security Level',
      value: 'Protected',
      icon: <FaShieldAlt className="text-green-500 text-xl" />,
    },
    {
      title: 'Dark Mode',
      value: darkMode ? 'On' : 'Off',
      icon: darkMode ? (
        <FaMoon className="text-purple-500 text-xl" />
      ) : (
        <FaSun className="text-yellow-500 text-xl" />
      ),
    },
    {
      title: 'Status',
      value: 'Active',
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
    },
  ];

  const quickActions = [
    {
      name: 'Refresh Data',
      action: () => fetchDashboardData(),
      icon: <FaSyncAlt className="text-blue-500 text-lg" />,
      description: 'Update dashboard information',
    },
    {
      name: 'Copy User ID',
      action: () => navigator.clipboard.writeText(user?.id || ''),
      icon: <FaClipboard className="text-gray-500 text-lg" />,
      description: 'Copy your user identifier',
    },
    {
      name: 'View Profile',
      action: () => setActiveTab('profile'),
      icon: <FaUser className="text-purple-500 text-lg" />,
      description: 'See your account details',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <HiOutlineUserCircle className="text-white text-2xl" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>Welcome back,</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {user?.username}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2 px-3 py-2 rounded-lg"
              >
                {logoutLoading ? (
                  <LoadingSpinner size={18} />
                ) : (
                  <>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center space-x-4"
            >
              <div>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="mb-2">{action.icon}</div>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {action.name}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
