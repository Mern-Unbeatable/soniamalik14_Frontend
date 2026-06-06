import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Eye, EyeOff, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword as resetPasswordThunk, selectAuthLoading, selectPasswordResetEmail, selectVerifiedOtp } from '../../../features/auth/authSlice';
import { toast } from 'react-toastify';

const ResetPasswordView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const loading = useSelector(selectAuthLoading);
  const email = useSelector(selectPasswordResetEmail);
  const verifiedOtp = useSelector(selectVerifiedOtp);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email || !verifiedOtp) {
      newErrors.form = 'Session expired. Please verify OTP again.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      (async () => {
        try {
          const payload = await dispatch(
            resetPasswordThunk({
              email,
              otp: verifiedOtp,
              newPassword: formData.password,
            })
          ).unwrap();

          toast.success(payload?.message || 'Password reset successfully. Please sign in.');
          navigate('/signin');
        } catch (err) {
          const message = err?.message || err?.payload?.message || 'Password reset failed';
          setErrors({ form: message });
          toast.error(message);
        }
      })();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-btn-primary hover:text-[#0d655d] font-medium text-base transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#282828] text-center mb-3">
            Reset Password
          </h1>
          <p className="text-[#666666] text-base text-center">
            Duis sagittis molestie tellus, at eleifend sapien pellque quis. Fusce lorem nunc, fringilla sit amet nunc.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-base text-center">
              {errors.form}
            </div>
          )}

          <div>
            <label className="block text-[#282828] font-medium mb-2 text-base">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="8+ characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-btn-primary focus:border-transparent transition-all text-base text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-btn-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[#282828] font-medium mb-2 text-base">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder=""
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-btn-primary focus:border-transparent transition-all text-base text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-btn-primary transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-btn-primary hover:bg-[#0d655d] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase text-base tracking-wide"
          >
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordView;
