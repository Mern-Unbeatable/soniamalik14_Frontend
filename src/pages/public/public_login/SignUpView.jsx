import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerThunk, ROLES, selectAuthLoading } from '../../../features/auth/authSlice';

// Declare components outside to fix "Cannot create components during render" error
const InputField = ({ label, name, placeholder, type = "text", optional = false, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[#1A1D1F] text-sm md:text-base font-medium mb-2">
      {label} {optional && <span className="text-gray-400 font-normal">(optional)</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-[#C2DBD9]/60 rounded-lg outline-none focus:ring-1 focus:ring-[#00796B] transition-all placeholder-gray-500 text-[#1A1D1F]"
    />
  </div>
);

const REGISTER_ROLE_QUERY_MAP = {
  player: 'Player',
  'sport-provider': 'Sport provider',
  'service-provider': 'Service Provider',
};

const RegisterView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [searchParams] = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  const initialRole = REGISTER_ROLE_QUERY_MAP[roleFromQuery] || 'Player';

  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [confirmSuitableSessions, setConfirmSuitableSessions] = useState(false);

  useEffect(() => {
    if (roleFromQuery && REGISTER_ROLE_QUERY_MAP[roleFromQuery]) {
      setRole(REGISTER_ROLE_QUERY_MAP[roleFromQuery]);
    }
  }, [roleFromQuery]);

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    postcode: '',
    displayName: '',
    firstName: '',
    lastName: '',
    ageRange: '',
    interestedSports: [],
    orgName: '',
    aboutOrg: '',
    sportsOffered: [],
    fullName: '',
    serviceType: [],
    practitionerName: '',
    aboutService: '',
  });

  const sportsOptions = ['Football', 'Squash', 'Rugby', 'Netball', 'Cricket', 'Padel', 'Tennis', 'Badminton', 'Golf', 'Running', 'Other'];
  const serviceOptions = ['Physiotherapy', 'Nutrition', 'Personal Training', 'Sports Massage', 'Mental Health & Wellbeing', 'Coaching', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (listName, value) => {
    setFormData(prev => {
      const list = prev[listName];
      return {
        ...prev,
        [listName]: list.includes(value) ? list.filter(i => i !== value) : [...list, value]
      };
    });
  };

  const resolveName = () => {
    if (role === 'Player') {
      return formData.displayName?.trim() || `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName?.trim() || 'Player';
    }

    if (role === 'Sport provider') {
      return formData.orgName?.trim() || formData.fullName?.trim() || 'Sport Provider';
    }

    return formData.practitionerName?.trim() || formData.fullName?.trim() || 'Service Provider';
  };

  const buildPayload = () => {
    const common = {
      email: formData.email.trim(),
      password: formData.password,
      name: resolveName(),
      phone: formData.phoneNumber?.trim() || undefined,
      postcode: formData.postcode?.trim() || undefined,
    };

    if (role === 'Player') {
      return {
        ...common,
        role: ROLES.USER.toUpperCase(),
        firstName: formData.firstName?.trim() || undefined,
        lastName: formData.lastName?.trim() || undefined,
        displayName: formData.displayName?.trim() || undefined,
        ageRange: formData.ageRange?.trim() || undefined,
        sportsInterests: formData.interestedSports,
      };
    }

    if (role === 'Sport provider') {
      return {
        ...common,
        role: ROLES.COACH.toUpperCase(),
        firstName: formData.fullName?.trim() || undefined,
        organizationName: formData.orgName?.trim(),
        sportsOffered: formData.sportsOffered,
        aboutOrganization: formData.aboutOrg?.trim() || undefined,
      };
    }

    return {
      ...common,
      role: ROLES.PROVIDER.toUpperCase(),
      firstName: formData.fullName?.trim() || undefined,
      organizationName: formData.practitionerName?.trim(),
      serviceTypes: formData.serviceType,
      aboutOrganization: formData.aboutService?.trim() || undefined,
    };
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return 'Email is required';
    }

    if (!formData.password) {
      return 'Password is required';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (!resolveName()) {
      return 'Name is required';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Password and confirm password must match';
    }

    if (role === 'Sport provider') {
      if (!formData.orgName.trim()) {
        return 'Organisation or coach name is required';
      }
      if (!confirmSuitableSessions) {
        return 'You must confirm that your sessions are suitable and welcoming for women to attend';
      }
    }

    if (role === 'Service Provider') {
      if (!formData.practitionerName.trim()) {
        return 'Organisation or practitioner name is required';
      }
    }

    if (!agreeToTerms) {
      return "You must agree to ESSA Hub's Terms & Conditions and Privacy Policy";
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = buildPayload();
    try {
      await dispatch(registerThunk(payload)).unwrap();
    } catch (err) {
      const message = err?.message || err?.payload?.message || err?.payload || 'Registration failed';
      setError(message);
      return;
    }

    toast.success('Registration successful. Please sign in.');
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-[#E7F1F1] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl bg-transparent">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-[#00796B] text-lg">
            {role === 'Player' ? 'Join the ESSA community' : role === 'Sport provider' ? 'Join ESSA and start listing your sessions.' : 'Join ESSA and support women in sport, fitness and wellbeing.'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* I'm joining as */}
          <div>
            <label className="block text-[#1A1D1F] font-medium mb-2">I'm joining as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#C2DBD9] rounded-lg outline-none appearance-none cursor-pointer font-medium"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
            >
              <option value="Player">Player</option>
              <option value="Sport provider">Sport provider</option>
              <option value="Service Provider">Service Provider</option>
            </select>
          </div>

          {/* Player Form */}
          {role === 'Player' && (
            <>
              <div>
                <InputField label="Display name" name="displayName" placeholder="e.g. SportSeeker" optional value={formData.displayName} onChange={handleChange} />
                <p className="text-xs text-gray-500 mt-1">
                  This name will be shown if you post in the community. If left blank, your first name will be displayed.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" name="firstName" placeholder="Your first name" value={formData.firstName} onChange={handleChange} />
                <InputField label="Last Name" name="lastName" placeholder="Your last name" value={formData.lastName} onChange={handleChange} />
              </div>
              <InputField label="Email" name="email" placeholder="Your email address" type="email" value={formData.email} onChange={handleChange} />
              <InputField label="Phone number" name="phoneNumber" placeholder="Best contact number" optional value={formData.phoneNumber} onChange={handleChange} />
              <InputField label="Postcode" name="postcode" placeholder="e.g. SW20" value={formData.postcode} onChange={handleChange} />

              <div>
                <label className="block text-[#1A1D1F] text-sm md:text-base font-medium mb-2">
                  Age range <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#C2DBD9]/60 rounded-lg outline-none focus:ring-1 focus:ring-[#00796B] transition-all text-[#1A1D1F] appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                >
                  <option value="">Select age range</option>
                  <option value="18-29">18-29</option>
                  <option value="30-44">30-44</option>
                  <option value="45+">45+</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1A1D1F] font-medium mb-3">Which sports are you interested in?</label>
                <div className="flex flex-wrap gap-2">
                  {sportsOptions.map(sport => (
                    <button key={sport} type="button" onClick={() => handleCheckboxChange('interestedSports', sport)}
                      className={`px-4 py-1.5 rounded-full border text-sm transition-all ${formData.interestedSports.includes(sport) ? 'bg-[#00796B] text-white border-[#00796B]' : 'bg-[#C2DBD9]/60 text-[#00796B] border-[#00796B]/20'}`}>{sport}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sport Provider Form */}
          {role === 'Sport provider' && (
            <>
              <InputField label="Organisation or coach name" name="orgName" placeholder="e.g. Woking Warriors FC" value={formData.orgName} onChange={handleChange} />
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-2">About your organisation</label>
                <textarea name="aboutOrg" placeholder="Tell us briefly about your club, coaching or sports group." className="w-full px-4 py-3 bg-[#C2DBD9]/60 rounded-lg outline-none h-28 text-[#1A1D1F]" value={formData.aboutOrg} onChange={handleChange} />
              </div>
              <InputField label="Main location postcode" name="postcode" placeholder="e.g. SW1A 1AA" value={formData.postcode} onChange={handleChange} />
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-3">Sports offered</label>
                <div className="flex flex-wrap gap-2">
                  {sportsOptions.map(sport => (
                    <button key={sport} type="button" onClick={() => handleCheckboxChange('sportsOffered', sport)}
                      className={`px-4 py-1.5 rounded-full border text-sm ${formData.sportsOffered.includes(sport) ? 'bg-[#00796B] text-white' : 'bg-[#C2DBD9]/60 text-[#00796B]'}`}>{sport}</button>
                  ))}
                </div>
              </div>
              <div className="pt-4"><h3 className="font-bold text-xl text-black">Primary contact details</h3></div>
              <InputField label="Full Name" name="fullName" placeholder="Your full name" value={formData.fullName} onChange={handleChange} />
              <InputField label="Email" name="email" placeholder="Your email address" value={formData.email} onChange={handleChange} />
              <InputField label="Phone Number" name="phoneNumber" placeholder="Best contact number" value={formData.phoneNumber} onChange={handleChange} />
            </>
          )}

          {/* Service Provider Form */}
          {role === 'Service Provider' && (
            <>
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-3">Service Type</label>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map(service => (
                    <button key={service} type="button" onClick={() => handleCheckboxChange('serviceType', service)}
                      className={`px-4 py-1.5 rounded-full border text-sm ${formData.serviceType.includes(service) ? 'bg-[#00796B] text-white' : 'bg-[#C2DBD9]/60 text-[#00796B]'}`}>{service}</button>
                  ))}
                </div>
              </div>
              <InputField label="Organisation or practitioner name" name="practitionerName" placeholder="Your business or practice name" value={formData.practitionerName} onChange={handleChange} />
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-2">About your services</label>
                <textarea name="aboutService" placeholder="Tell us briefly about the services you offer." className="w-full px-4 py-3 bg-[#C2DBD9]/60 rounded-lg outline-none h-28 text-[#1A1D1F]" value={formData.aboutService} onChange={handleChange} />
              </div>
              <InputField label="Main location postcode" name="postcode" placeholder="e.g. SW1A 1AA" value={formData.postcode} onChange={handleChange} />
              <div className="pt-4"><h3 className="font-bold text-xl text-black">Primary contact details</h3></div>
              <InputField label="Full Name" name="fullName" placeholder="Your full name" value={formData.fullName} onChange={handleChange} />
              <InputField label="Email" name="email" placeholder="Your email address" value={formData.email} onChange={handleChange} />
              <InputField label="Phone Number" name="phoneNumber" placeholder="Best contact number" value={formData.phoneNumber} onChange={handleChange} />
            </>
          )}

          {/* Password Section */}
          <div className="relative">
            <InputField label="Password" name="password" placeholder="Minimum 8 characters" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-10.5 text-gray-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <InputField label="Confirm Password" name="confirmPassword" placeholder="Re-type your password" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-10.5 text-gray-500">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Checkboxes Section */}
          <div className="space-y-4 pt-2">
            {role === 'Sport provider' && (
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmSuitableSessions}
                  onChange={(e) => setConfirmSuitableSessions(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#00796B] focus:ring-[#00796B] cursor-pointer"
                />
                <span className="text-sm md:text-base text-gray-700 font-medium">
                  I confirm that any sessions I list on ESSA Hub will be suitable and welcoming for women to attend.
                </span>
              </label>
            )}

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#00796B] focus:ring-[#00796B] cursor-pointer"
              />
              <span className="text-sm md:text-base text-gray-700 font-medium">
                I agree to ESSA Hub's <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black hover:text-[#00796B]">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-black hover:text-[#00796B]">Privacy Policy</a>.
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#00796B] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-gray-600">
            Already have an account? <Link to="/signin" className="text-black font-semibold underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;