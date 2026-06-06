import React from 'react';
import { ChevronDown } from 'lucide-react';

const DemandTabs = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="mb-6">
            {/* Mobile View: Select Dropdown */}
            <div className="md:hidden relative">
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent font-medium text-base"
                >
                    {tabs.map(tab => (
                        <option key={tab} value={tab}>{tab}</option>
                    ))}
                </select>
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Desktop View: Tabs inside a white card */}
            <div className="hidden md:inline-flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden px-4 pt-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-4 text-base font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab
                            ? 'text-[#0f766e] border-[#0f766e]'
                            : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DemandTabs;
