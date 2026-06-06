import React from 'react';

const TabsSection = ({ activeTab, activeSubTab, setActiveTab, setActiveSubTab }) => {
    return (
        <>
            {/* Main Tabs - Mobile View (Select Tag) */}
            <div className="block sm:hidden mb-6 relative ">
                <select
                    value={activeTab}
                    onChange={(e) => {
                        setActiveTab(e.target.value);
                        setActiveSubTab('all');
                    }}
                    className="w-full px-4 py-2.5 border border-[#91C0BC] rounded-md text-base font-medium appearance-none text-gray-800 bg-white focus:outline-none focus:border-[#0B544E] focus:ring-1 focus:ring-[#0B544E]"
                >
                    <option value="players">Players</option>
                    <option value="sportProviders">Sport Providers</option>
                    <option value="serviceProviders">Service Providers</option>
                </select>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            {/* Main Tabs - Desktop View (Buttons) */}
            <div className="hidden sm:flex gap-4 mb-8">
                <button
                    onClick={() => { setActiveTab('players'); setActiveSubTab('all'); }}
                    className={`px-5 py-2 rounded-md text-base font-medium transition ${activeTab === 'players' ? 'border border-[#91C0BC] text-gray-800 shadow-sm bg-gray-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Players
                </button>
                <button
                    onClick={() => { setActiveTab('sportProviders'); setActiveSubTab('all'); }}
                    className={`px-5 py-2 rounded-md text-base font-medium transition ${activeTab === 'sportProviders' ? 'border border-[#91C0BC] text-gray-800 shadow-sm bg-gray-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Sport Providers
                </button>
                <button
                    onClick={() => { setActiveTab('serviceProviders'); setActiveSubTab('all'); }}
                    className={`px-5 py-2 rounded-md text-base font-medium transition ${activeTab === 'serviceProviders' ? 'border border-[#91C0BC] text-gray-800 shadow-sm bg-gray-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Service Providers
                </button>
            </div>

            {/* Sub Tabs (Kept responsive for both mobile and desktop) */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex w-full">
                    <button
                        onClick={() => setActiveSubTab('all')}
                        className={`flex-1 pb-3 text-base font-medium text-center transition ${activeSubTab === 'all' ? 'text-[#0B544E] border-b-2 border-[#0B544E]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {activeTab === 'players' && 'All Players'}
                        {activeTab === 'sportProviders' && 'All Sport Providers'}
                        {activeTab === 'serviceProviders' && 'All Service Providers'}
                    </button>
                    <button
                        onClick={() => setActiveSubTab('suspended')}
                        className={`flex-1 pb-3 text-base font-medium text-center transition ${activeSubTab === 'suspended' ? 'text-[#0B544E] border-b-2 border-[#0B544E]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Suspended
                    </button>
                </div>
            </div>
        </>
    );
};

export default TabsSection;