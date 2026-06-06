import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    email: 'alma.lawson@example.com',
    phone: '0412 345 678',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen  dashboardPy dashboardSpaceY">
      <div className="  ">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-8 rounded"
          >
            Save
          </button>
        </div>

        {/* Personal Details Card */}
        <div className="bg-[#91C0BC] rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Details</h2>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alma.lawson@example.com"
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0412 345 678"
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Old Password Field */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-1.5">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="******"
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="******"
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label className="block text-base font-medium text-gray-800 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="******"
                className="w-full px-4 py-3 bg-gray-50 text-gray-700 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}