import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserDashboardSidebar from './UserDashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import DashboardNavbar from './DashboardNavbar';
import ScrollToTop from '../ScrollToTop.jsx';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const { user } = useAuth();

    const renderSidebar = () => {
        // If regular user, render the simple user sidebar. Otherwise use existing Sidebar.
        if (user?.role === 'user') {
            return <UserDashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />;
        }
        return <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />;
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <ScrollToTop />
            {/* Sidebar */}
            {renderSidebar()}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard Navbar */}
                <DashboardNavbar onMenuClick={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;