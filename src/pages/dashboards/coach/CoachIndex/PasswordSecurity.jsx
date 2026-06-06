import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { changePassword } from '../../../../services/authService';

const PasswordSecurity = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const result = await changePassword(passwords.current, passwords.newPass, passwords.confirm);
      if (result?.success) {
        setPasswords({ current: '', newPass: '', confirm: '' });
      }
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Change Password</h2>
      </div>

      <form className="p-6 space-y-4 max-w-full" onSubmit={handlePasswordSubmit}>
        <div className="space-y-1">
          <label className="text-base text-gray-700 font-medium">Current Password</label>
          <div className="relative">
            <input
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              type={showCurrent ? 'text' : 'password'}
              className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            {showCurrent ? (
              <EyeOff
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-base text-gray-700 font-medium">New Password</label>
          <div className="relative">
            <input
              name="newPass"
              value={passwords.newPass}
              onChange={handlePasswordChange}
              type={showNew ? 'text' : 'password'}
              placeholder="8+ characters"
              className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-sm"
            />
            {showNew ? (
              <EyeOff
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-base text-gray-700 font-medium">Confirm Password</label>
          <div className="relative">
            <input
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              type={showConfirm ? 'text' : 'password'}
              className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
            {showConfirm ? (
              <EyeOff
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            ) : (
              <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={changingPassword}
            className="bg-[#147A73] text-white px-6 py-2.5 rounded-sm font-bold text-sm uppercase hover:bg-[#0d5e58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSecurity;
