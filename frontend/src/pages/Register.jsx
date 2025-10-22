import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import DarkModeToggle from "../components/DarkModeToggle";
import { FaUser } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [flipCard, setFlipCard] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "Username is required";
        } else if (value.length < 3) {
          newErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username =
            "Username can only contain letters, numbers, and underscores";
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== value) {
          newErrors.confirmPassword = "Passwords do not match";
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

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 const toggleFlip = () => setFlipCard(!flipCard);
  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return "default";
    if (errors[fieldName]) return "error";
    if (formData[fieldName]) return "success";
    return "default";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) {
      const form = e.target;
      form.classList.add("animate-shake");
      setTimeout(() => form.classList.remove("animate-shake"), 500);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please login with your new account.",
        },
      });
    } catch (error) {
      // Handle rate limit error specifically
      if (error.response?.status === 429) {
        setSubmitError(
          "Too many registration attempts. Please try again after 15 minutes."
        );
      } else {
        setSubmitError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full 
        mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200 rounded-full 
        mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div
        className={`max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 z-20 relative transition-opacity duration-300 ${
          flipCard
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">
              <FaUser className="text-2xl text-white" />
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div
              className={`px-4 py-3 rounded-lg border animate-slide-down ${
                submitError.includes("Too many registration attempts")
                  ? "bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200"
                  : "bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200"
              }`}>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  {submitError.includes("Too many registration attempts") ? (
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                <span className="font-medium">
                  {submitError.includes("Too many registration attempts")
                    ? "Security Notice:"
                    : "Error:"}
                </span>
              </div>
              <span className="block mt-1 text-sm">{submitError}</span>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.username}
              required
              autoComplete="username"
              placeholder="Enter your username"
              className={
                getFieldStatus("username") === "success"
                  ? "border-green-500 focus:ring-green-500"
                  : getFieldStatus("username") === "error"
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              autoComplete="email"
              placeholder="Enter your email address"
              className={
                getFieldStatus("email") === "success"
                  ? "border-green-500 focus:ring-green-500"
                  : getFieldStatus("email") === "error"
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }
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
                autoComplete="new-password"
                placeholder="Enter your password"
                className={
                  getFieldStatus("password") === "success"
                    ? "border-green-500 focus:ring-green-500"
                    : getFieldStatus("password") === "error"
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[45px] text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={
                  getFieldStatus("confirmPassword") === "success"
                    ? "border-green-500 focus:ring-green-500"
                    : getFieldStatus("confirmPassword") === "error"
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[48px] text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={Object.keys(errors).length > 0 || loading}
            className="relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2"></span>
                Create Account
              </div>
            )}
          </Button>
        </form>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Quick Info:
          </h3>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Username: 3+ characters (letters, numbers, _ only)</li>
            <li>• Password: 6+ characters</li>
            <li>• Use valid email format</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
