import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import DarkModeToggle from "../components/DarkModeToggle";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    login: false,
    password: false,
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const [flipCard, setFlipCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSubmitError(location.state.message);
    }
  }, [location]);

  useEffect(() => {
    setSubmitError("");
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    switch (fieldName) {
      case "login":
        if (!value.trim()) {
          newErrors.login = "Email or username is required";
        } else if (value.trim().length < 3) {
          newErrors.login =
            "Email or username must be at least 3 characters long";
        } else if (value.includes("@")) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.login = "Please enter a valid email address";
          }
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters long";
        }
        break;
      default:
        break;
    }

    if (!newErrors[fieldName]) {
      delete newErrors[fieldName];
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.login.trim()) {
      newErrors.login = "Email or username is required";
    } else if (formData.login.trim().length < 3) {
      newErrors.login = "Email or username must be at least 3 characters long";
    } else if (formData.login.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.login)) {
        newErrors.login = "Please enter a valid email address";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    setTouched({
      login: true,
      password: true,
    });

    if (!validateForm()) {
      const form = e.target;
      form.classList.add("animate-shake");
      setTimeout(() => form.classList.remove("animate-shake"), 500);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setSubmitError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // Handle rate limit error specifically
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || 60;
        setSubmitError(
          `Too many login attempts. Please try again in ${retryAfter} seconds.`
        );
      } else {
        setSubmitError(
          error.response?.data?.message ||
            error.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = () => setFlipCard(!flipCard);
  const fillDemoAccount = (username, password) => {
    setFormData({
      login: username,
      password: password,
    });
    setErrors({});
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <DarkModeToggle />
      </div>

      {/* Login Card */}
      <div
        className={`relative w-full max-w-md z-50 transition-all duration-500 ${
          flipCard ? "transform rotate-y-180" : ""
        }`}>
        {/* Front Side */}
        <div
          className={`relative w-full ${
            flipCard ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-500 hover:scale-105 relative z-50">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <span className="text-xl text-white">
                    <FaLock className="text-xl text-white" />
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
                Sign in to your account to continue
              </p>
            </div>

            <form
              className="space-y-6 relative z-50"
              onSubmit={handleSubmit}
              noValidate>
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200 animate-slide-down">
                  <span className="font-medium">Error: </span>
                  {submitError}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Email or Username"
                  name="login"
                  type="text"
                  value={formData.login}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.login}
                  required
                  autoComplete="username"
                  placeholder="Enter your email or username"
                />

                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[48px] text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={Object.keys(errors).length > 0 || loading}
                className="relative z-50 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 hover:underline hover:underline-offset-4">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div
        className={`absolute inset-0 ${
          flipCard ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 transform rotate-y-180`}>
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-8 rounded-2xl shadow-2xl text-white h-full flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-center mb-6">Quick Info</h3>
            <p className="text-sm text-center">
              JWT secure login, responsive UI, dark mode, and animation ready.
            </p>
          </div>
          <button
            onClick={toggleFlip}
            className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
