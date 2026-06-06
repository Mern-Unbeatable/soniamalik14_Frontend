import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

/* ────────────────────────────────────────────────────────────────
   Reusable labelled input
──────────────────────────────────────────────────────────────── */
const Field = ({ label, id, type = 'text', value, onChange, placeholder, rightElement }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-3 flex items-center">{rightElement}</div>
      )}
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   Section card wrapper
──────────────────────────────────────────────────────────────── */
const SectionCard = ({ title, children, onSubmit }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    {/* Teal header strip */}
    <div className=" px-6 py-4 border-b border-gray-300">
      <h2 className="text-base font-semibold text-black">{title}</h2>
    </div>

    <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
      {children}
    </form>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   Main Component
──────────────────────────────────────────────────────────────── */
const AdminProfile = () => {
  const { user } = useAuth();

  /* ── Personal details state ── */
  const [personal, setPersonal] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handlePersonalChange = (field) => (e) =>
    setPersonal((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    // TODO: dispatch update profile thunk
    console.log('Save personal:', personal);
  };

  /* ── Password state ── */
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });

  const toggleShow = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handlePasswordChange = (field) => (e) =>
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      alert('New passwords do not match.');
      return;
    }
    // TODO: dispatch change password thunk
    console.log('Change password submitted');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const EyeToggle = ({ field }) => (
    <button
      type="button"
      onClick={() => toggleShow(field)}
      className="text-gray-400 hover:text-gray-600 transition-colors"
      tabIndex={-1}
    >
      {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">

      {/* Page title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Manage your admin account information.
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Section 1 : Personal Details ── */}
        <SectionCard title="Personal Details" onSubmit={handlePersonalSubmit}>
          <Field
            id="admin-profile-name"
            label="Name"
            value={personal.name}
            onChange={handlePersonalChange('name')}
            placeholder="Admin User"
          />
          <Field
            id="admin-profile-email"
            label="Email"
            type="email"
            value={personal.email}
            onChange={handlePersonalChange('email')}
            placeholder="admin@essahub.com"
          />
          <Field
            id="admin-profile-phone"
            label="Phone Number"
            type="tel"
            value={personal.phone}
            onChange={handlePersonalChange('phone')}
            placeholder="+44 000 000 0000"
          />

          <div className="pt-1">
            <button
              id="admin-profile-save-btn"
              type="submit"
              className="px-8 py-2.5 bg-[#0f766e] hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </SectionCard>

        {/* ── Section 2 : Change Password ── */}
        <SectionCard title="Change Password" onSubmit={handlePasswordSubmit}>
          <Field
            id="admin-profile-current-password"
            label="Current Password"
            type={show.current ? 'text' : 'password'}
            value={passwords.current}
            onChange={handlePasswordChange('current')}
            placeholder="Enter current password"
            rightElement={<EyeToggle field="current" />}
          />
          <Field
            id="admin-profile-new-password"
            label="New Password"
            type={show.newPass ? 'text' : 'password'}
            value={passwords.newPass}
            onChange={handlePasswordChange('newPass')}
            placeholder="Enter new password"
            rightElement={<EyeToggle field="newPass" />}
          />
          <Field
            id="admin-profile-confirm-password"
            label="Confirm New Password"
            type={show.confirm ? 'text' : 'password'}
            value={passwords.confirm}
            onChange={handlePasswordChange('confirm')}
            placeholder="Re-enter new password"
            rightElement={<EyeToggle field="confirm" />}
          />

          <div className="pt-1">
            <button
              id="admin-profile-change-password-btn"
              type="submit"
              className="px-8 py-2.5 bg-[#0f766e] hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              Change Password
            </button>
          </div>
        </SectionCard>

      </div>
    </div>
  );
};

export default AdminProfile;
