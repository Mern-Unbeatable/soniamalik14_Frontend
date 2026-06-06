import React, { useState } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5';
import ApplicantModal from './ApplicantModal';

const RecentPlayerActivity = ({ players }) => {
    const [selected, setSelected] = useState(null);

    const openModal = (player) => setSelected(player);
    const closeModal = () => setSelected(null);

    return (
        <div className="">

            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Player Activity</h1>
            </div>

            {/* Main Content Area */}
            <div className="  overflow-hidden">

                {/* Mobile Card View */}
                <div className="block md:hidden  space-y-3">
                    {players.map((player, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-2 bg-white shadow-sm">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-[#374151] pb-2">{player.name}</p>
                                    <p className="text-sm text-[#374151] py-0.5">{player.phone}</p>
                                    <p className="text-sm text-[#374151] py-0.5 break-all">{player.email}</p>
                                </div>
                                <button
                                    onClick={() => openModal(player)}
                                    className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-all"
                                >
                                    <IoChevronForwardOutline className="text-xl text-black" />
                                </button>
                            </div>
                            <p className="text-sm text-[#4B5563] leading-relaxed line-clamp-2">{player.message}</p>
                            <p className="text-xs text-[#374151] font-medium">{player.date}</p>
                        </div>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#E7F1F1] border-b border-gray-100">
                                <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Player Name</th>
                                <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Phone number</th>
                                <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Email</th>
                                <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Message</th>
                                <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {players.map((player, idx) => (
                                <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-6 text-sm text-[#374151] font-medium">{player.name}</td>
                                    <td className="px-6 py-6 text-sm text-[#374151] whitespace-nowrap">{player.phone}</td>
                                    <td className="px-6 py-6 text-sm text-[#374151] max-w-[150px] break-words leading-relaxed">{player.email}</td>
                                    <td className="px-6 py-6 text-sm text-[#4B5563] max-w-[300px] leading-relaxed">{player.message}</td>
                                    <td className="px-6 py-6 text-sm text-[#374151] whitespace-nowrap">{player.date}</td>
                                    <td className="px-6 py-6 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                                        <button onClick={() => openModal(player)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white hover:shadow-sm transition-all">
                                            <IoChevronForwardOutline className="text-xl text-black" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-[#0f766e]">
                        Showing 1 to {players.length} of {players.length} results
                    </span>
                    <div className="flex gap-2">
                        <button className="px-5 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                            Previous
                        </button>
                        <button className="px-5 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                            Next
                        </button>
                    </div>
                </div>

                <ApplicantModal applicant={selected} onClose={closeModal} />

            </div>
        </div>
    );
};

export default RecentPlayerActivity;
