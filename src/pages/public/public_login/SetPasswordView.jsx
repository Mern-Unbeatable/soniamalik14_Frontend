import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { GET, POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';

const inputClassName =
  'w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-3 pr-11 text-base text-[#1A1D1D] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/40';

const checkboxClassName = 'mt-1 h-5 w-5 cursor-pointer rounded border-white/30 accent-[#0f756d]';

const INVALID_LINK_MESSAGE = 'This invite link is invalid or has expired. Please contact ESSA Hub for a new link.';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message || fallback;

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [invite, setInvite] = useState(null);
  const [checkingLink, setCheckingLink] = useState(Boolean(token));
  const [linkError, setLinkError] = useState(token ? '' : INVALID_LINK_MESSAGE);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [confirmSuitableSessions, setConfirmSuitableSessions] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSportProvider = invite?.role === 'COACH';

  useEffect(() => {
    if (!token) return undefined;

    const controller = new AbortController();
    GET(ENDPOINT.AUTH.INVITE_DETAILS(token), undefined, controller.signal)
      .then((response) => setInvite(response?.data?.data || null))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setLinkError(getErrorMessage(err, INVALID_LINK_MESSAGE));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCheckingLink(false);
      });

    return () => controller.abort();
  }, [token]);

  const validate = () => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Password and confirm password must match';
    if (isSportProvider && !confirmSuitableSessions) {
      return 'You must confirm that your sessions are suitable and welcoming for women to attend';
    }
    if (!agreeToTerms) return "You must agree to ESSA Hub's Terms & Conditions and Privacy Policy";
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      await POST(ENDPOINT.AUTH.ACCEPT_INVITE, { token, password, agreeToTerms: true });
      toast.success('Your password is set. Please log in to access your account.');
      navigate('/signin');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not set your password. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    if (checkingLink) {
      return <p className="text-lg text-white/85">Checking your invite link...</p>;
    }

    if (linkError) {
      return (
        <div className="space-y-6">
          <div className="rounded-lg border border-red-300 bg-red-500/20 px-4 py-3 text-white">{linkError}</div>
          <p className="text-center text-white/80">
            Already set your password?{' '}
            <Link to="/signin" className="font-semibold text-white underline hover:text-[#F5F1EB]">
              Log in
            </Link>
          </p>
        </div>
      );
    }

    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-500/20 px-4 py-3 text-sm text-white">{error}</div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-white md:text-base">Email</label>
          <input value={invite?.email || ''} readOnly className={`${inputClassName} cursor-not-allowed opacity-80`} />
        </div>

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

        <div className="space-y-4 pt-2">
          {isSportProvider && (
            <label className="flex cursor-pointer items-start gap-3 select-none">
              <input
                type="checkbox"
                checked={confirmSuitableSessions}
                onChange={(e) => setConfirmSuitableSessions(e.target.checked)}
                className={checkboxClassName}
              />
              <span className="text-sm font-medium text-white/90 md:text-base">
                I confirm that any sessions I list on ESSA Hub will be suitable and welcoming for women to attend.
              </span>
            </label>
          )}

          <label className="flex cursor-pointer items-start gap-3 select-none">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className={checkboxClassName}
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
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[#F5F1EB] py-4 text-lg font-bold text-[#0f756d] transition-all hover:bg-white hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Set password & continue'}
        </button>

        <p className="text-center text-white/80">
          Already set your password?{' '}
          <Link to="/signin" className="font-semibold text-white underline hover:text-[#F5F1EB]">
            Log in
          </Link>
        </p>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f756d] p-4 sm:p-8">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">
            {invite?.name ? `Welcome, ${invite.name}` : 'Welcome to ESSA Hub'}
          </h1>
          <p className="text-lg text-white/85">
            Your account has been set up for you. Choose a password to access your dashboard, review your
            details and manage your listings.
          </p>
        </div>

        {renderBody()}
      </div>
    </div>
  );
};

export default SetPasswordView;
