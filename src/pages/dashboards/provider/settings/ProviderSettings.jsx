import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ProviderProfileSection from './ProviderProfileSection';
import ProviderPasswordSection from './ProviderPasswordSection';

const ProviderSettings = () => {
    const { user, fetchMe } = useAuth();

    return (
        <div className="dashboardPy dashboardSpaceY">
            <header className="space-y-2">
                <h1 className="text-2xl lg:text-4xl font-semibold text-[#1D1D1D]">Profile</h1>
                <p className="text-base text-[#6B7280]">Manage your account settings and preferences</p>
            </header>

            <ProviderProfileSection user={user} fetchMe={fetchMe} />
            <ProviderPasswordSection />
        </div>
    );
};

export default ProviderSettings;
