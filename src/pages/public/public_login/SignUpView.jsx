import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const RegisterView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);

  const [role, setRole] = useState('Player');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

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
    sessionType: 'Women Only',
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
        sessionType: formData.sessionType,
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

    if (!resolveName()) {
      return 'Name is required';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Password and confirm password must match';
    }

    if (role === 'Sport provider' && !formData.orgName.trim()) {
      return 'Organization name is required for sport provider';
    }

    if (role === 'Service Provider' && !formData.practitionerName.trim()) {
      return 'Organization name is required for service provider';
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
            {role === 'Player' ? 'Join the ESSA community' : role === 'Sport provider' ? 'Join ESSA and start listing your sessions.' : 'Join ESSA and help more women stay active.'}
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
              <InputField label="Display Name" name="displayName" placeholder="john doe" optional value={formData.displayName} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" name="firstName" placeholder="Enter name here" value={formData.firstName} onChange={handleChange} />
                <InputField label="Last Name" name="lastName" placeholder="Enter name here" value={formData.lastName} onChange={handleChange} />
              </div>
              <InputField label="Email" name="email" placeholder="enter your email" type="email" value={formData.email} onChange={handleChange} />
              <InputField label="Phone Number" name="phoneNumber" placeholder="enter your phone number" optional value={formData.phoneNumber} onChange={handleChange} />
              <InputField label="Postcode" name="postcode" placeholder="SW20" value={formData.postcode} onChange={handleChange} />

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
              <InputField label="Organization or Coach Name" name="orgName" placeholder="Woking Warriors FC" value={formData.orgName} onChange={handleChange} />
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-2">About your organisation</label>
                <textarea name="aboutOrg" placeholder="A short overview of what you offer and who your sessions are suitable for." className="w-full px-4 py-3 bg-[#C2DBD9]/60 rounded-lg outline-none h-28 text-[#1A1D1F]" value={formData.aboutOrg} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-2">Session type</label>
                <select name="sessionType" value={formData.sessionType} onChange={handleChange} className="w-full px-4 py-3 bg-[#C2DBD9] rounded-lg outline-none appearance-none cursor-pointer">
                  <option value="Women Only">Women Only</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <InputField label="Postcode" name="postcode" placeholder="SW1" value={formData.postcode} onChange={handleChange} />
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-3">Sports offered</label>
                <div className="flex flex-wrap gap-2">
                  {sportsOptions.map(sport => (
                    <button key={sport} type="button" onClick={() => handleCheckboxChange('sportsOffered', sport)}
                      className={`px-4 py-1.5 rounded-full border text-sm ${formData.sportsOffered.includes(sport) ? 'bg-[#00796B] text-white' : 'bg-[#C2DBD9]/60 text-[#00796B]'}`}>{sport}</button>
                  ))}
                </div>
              </div>
              <div className="pt-4"><h3 className="font-bold text-xl text-black">Primary Contact</h3></div>
              <InputField label="Full Name" name="fullName" placeholder="Enter Your Full Name" value={formData.fullName} onChange={handleChange} />
              <InputField label="Email" name="email" placeholder="Write your email" value={formData.email} onChange={handleChange} />
              <InputField label="Phone Number" name="phoneNumber" placeholder="enter your phone number" value={formData.phoneNumber} onChange={handleChange} />
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
              <InputField label="Organisation or Practitioner Name" name="practitionerName" placeholder="Woking Warriors FC" value={formData.practitionerName} onChange={handleChange} />
              <div>
                <label className="block text-[#1A1D1F] font-medium mb-2">About</label>
                <textarea name="aboutService" placeholder="A short overview of your services and who you support." className="w-full px-4 py-3 bg-[#C2DBD9]/60 rounded-lg outline-none h-28 text-[#1A1D1F]" value={formData.aboutService} onChange={handleChange} />
              </div>
              <InputField label="Postcode" name="postcode" placeholder="SW1" value={formData.postcode} onChange={handleChange} />
              <div className="pt-4"><h3 className="font-bold text-xl text-black">Primary Contact</h3></div>
              <InputField label="Full Name" name="fullName" placeholder="Enter Your Full Name" value={formData.fullName} onChange={handleChange} />
              <InputField label="Email" name="email" placeholder="Write your email" value={formData.email} onChange={handleChange} />
              <InputField label="Phone Number" name="phoneNumber" placeholder="enter your phone number" value={formData.phoneNumber} onChange={handleChange} />
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
            <InputField label="Confirm Password" name="confirmPassword" placeholder="**** **** ****" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-10.5 text-gray-500">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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