import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useAuth();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FiMoon size={20} className="text-yellow-400" />
      ) : (
        <FiSun size={20} className="text-orange-500" />
      )}
    </button>
  );
};

export default DarkModeToggle;
