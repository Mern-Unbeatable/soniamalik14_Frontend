import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const inputClassName =
  'w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-3 pr-11 text-base text-[#1A1D1D] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/40';

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white md:text-base">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const SetPasswordView = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!token) return 'This invite link is invalid or has expired. Please contact ESSA Hub for a new link.';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Password and confirm password must match';
    if (!agreeToTerms) return "You must agree to ESSA Hub's Terms & Conditions and Privacy Policy";
    return '';
  };

  // TODO: submit token + password + terms acceptance once the invite endpoint is built
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    toast.info('Design preview: setting your password will be connected next.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f756d] p-4 sm:p-8">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Welcome to ESSA Hub</h1>
          <p className="text-lg text-white/85">
            Your account has been set up for you. Choose a password to access your dashboard, review your
            details and manage your listings.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-500/20 px-4 py-3 text-sm text-white">
              {error}
            </div>
          )}

          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type your password"
          />

          <label className="flex cursor-pointer items-start gap-3 pt-2 select-none">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-5 w-5 cursor-pointer rounded border-white/30 accent-[#0f756d]"
            />
            <span className="text-sm font-medium text-white/90 md:text-base">
              I agree to ESSA Hub's{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline hover:text-[#F5F1EB]">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline hover:text-[#F5F1EB]">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#F5F1EB] py-4 text-lg font-bold text-[#0f756d] transition-all hover:bg-white hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Set password & continue
          </button>

          <p className="text-center text-white/80">
            Already set your password?{' '}
            <Link to="/signin" className="font-semibold text-white underline hover:text-[#F5F1EB]">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordView;
