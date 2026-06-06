import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginThunk, ROLES, selectAuthLoading } from '../../../features/auth/authSlice';
import { FaArrowLeft } from 'react-icons/fa';

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await dispatch(loginThunk({ email: formData.email, password: formData.password })).unwrap();
      const intended = location?.state?.from;
      const userRoleRaw = result?.user?.role || result?.role || '';
      const role = String(userRoleRaw).toLowerCase();

      if (intended) {
        navigate(intended, { replace: true });
        return;
      }

      if (role === ROLES.USER) {
        navigate('/');
      } else if (role === ROLES.ADMIN) {
        navigate('/admin');
      } else if (role === ROLES.PROVIDER) {
        navigate('/provider');
      } else if (role === ROLES.COACH) {
        navigate('/coach');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err?.message || 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full  flex items-center justify-center px-6 py-12 bg-secondary">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4">
              <Link to="/" className="inline-flex items-center text-base gap-1 text-btn-primary hover:text-[#0d655d] font-medium">
                <FaArrowLeft /> Back to Home
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#282828] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#363636] text-base md:text-base">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-base">
                {error}
              </div>
            )}

            {/* Demo Credentials Info */}
            {/* <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-base">
              <p className="font-semibold mb-2">Demo Credentials (Password: demo123)</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@essahub.com</p>
                <p><strong>Provider:</strong> provider@essahub.com</p>
                <p><strong>Coach:</strong> coach@essahub.com</p>
                <p><strong>User:</strong> user@essahub.com</p>
              </div>
            </div> */}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#282828] font-medium mb-2 text-base md:text-base">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@essahub.com"
                className="w-full px-4 py-3 bg-loginInput rounded-lg outline-none focus:ring-2 focus:ring-btn-primary transition-all text-base text-gray-700 placeholder-[#747474]"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[#282828] font-medium mb-2 text-base md:text-base">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="... ... ... ..."
                  className="w-full px-4 py-3 pr-12 bg-loginInput rounded-lg outline-none focus:ring-2 focus:ring-btn-primary transition-all text-base text-gray-700 placeholder-[#747474]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747474] hover:text-btn-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-base text-btn-primary hover:text-[#0d655d] font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-btn-primary hover:bg-[#0d655d] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            {/* Create Account Section */}
            <div className="text-center pt-4">
              <p className="text-base text-[#363636] mb-3">Don't have account</p>
              <Link
                to="/register"
                className="block w-full border-2 border-btn-primary text-btn-primary hover:bg-btn-primary hover:text-white py-3 rounded-lg font-medium transition-all"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </form>
        </div>
      </div>

    
    </div>
  );
};

export default LoginView;
