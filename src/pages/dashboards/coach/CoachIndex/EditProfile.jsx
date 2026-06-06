import React from 'react';
import PasswordSecurity from './PasswordSecurity';
import ProfileInfoSection from './ProfileInfoSection';

const EditProfile = () => {
    return (
        <div className="min-h-screen bg-[#F4F7F8] p-4 md:p-8 font-sans">
            <div className="">
                <header className="mb-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-[#1D1D1D]">Profile Settings</h1>
                    <p className="text-base text-gray-500 mt-1">Manage your account information and security</p>
                </header>

                <div className="space-y-8">
                    {/* Section 1: Profile Information */}
                    <ProfileInfoSection />

                    {/* Section 2: Password Security */}
                    <PasswordSecurity />
                </div>
            </div>
        </div>
    );
};

// ProfileInfoSection moved to its own file: ProfileInfoSection.jsx

export default EditProfile;