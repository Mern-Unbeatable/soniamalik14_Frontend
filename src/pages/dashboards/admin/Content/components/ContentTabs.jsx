import React from 'react';
import { ChevronDown } from 'lucide-react';

const ContentTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="mb-8">
            {/* Mobile Select (visible on small screens) */}
            <div className="lg:hidden relative">
                <select
                    value={activeTab}
                    onChange={(e) => onTabChange(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#0f766e]/20 outline-none cursor-pointer pr-10"
                >
                    {tabs.map((tab) => (
                        <option key={tab} value={tab}>
                            {tab}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" strokeWidth={2} />
            </div>

            {/* Desktop Tabs (visible on large screens) */}
            <div className="hidden lg:block overflow-x-auto no-scrollbar">
                <div className="inline-flex bg-white rounded-lg shadow-sm p-1 border border-gray-100 whitespace-nowrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab
                                    ? 'bg-[#0f766e] text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContentTabs;
