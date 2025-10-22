import React, { useState } from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = '',
  placeholder = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const getInputClasses = () => {
    let baseClasses = 'w-full px-3 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500';
    
    if (error) {
      baseClasses += ' border-red-500 focus:ring-red-500 dark:border-red-400';
    } else if (value && !error) {
      baseClasses += ' border-green-500 focus:ring-green-500 dark:border-green-400';
    } else {
      baseClasses += ' border-gray-300 focus:ring-blue-500 dark:border-gray-600';
    }
    
    return `${baseClasses} ${className}`;
  };

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleInputBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value || ''} 
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={getInputClasses()}
          placeholder={placeholder}
          autoComplete="on"
          {...props}
        />
        
        {value && !error && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-500 animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium focus:outline-none transition-colors duration-200"
          >
            {showPassword ? 'Hide' : ''}
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400 animate-slide-down">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;