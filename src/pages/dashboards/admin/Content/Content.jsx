import React, { useState } from 'react';
import ContentLandingPage from './components/ContentLandingPage';
import ContentAboutUS from './components/ContentAboutUS';
import ContentCollaboratePage from './components/ContentCollaboratePage';
import ContentNews from './components/ContentNews';
import ContentTabs from './components/ContentTabs';

const ContentManagement = () => {
    const [activeTab, setActiveTab] = useState('Landing Page');

    const tabs = ['Landing Page', 'About US', 'Collaborate page', 'News'];

    return (
        <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
            <div className="">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Content Management</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-2">Edit website pages, news articles, and media assets.</p>
                </div>

                {/* Tabs  */}
                <ContentTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Tab Content Rendering */}
                {activeTab === 'Landing Page' && <ContentLandingPage />}
                {activeTab === 'About US' && <ContentAboutUS />}
                {activeTab === 'Collaborate page' && <ContentCollaboratePage />}
                {activeTab === 'News' && <ContentNews />}

            </div>

            {/* Global style to hide scrollbar on the tabs */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default ContentManagement;