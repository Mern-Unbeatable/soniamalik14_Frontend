import React, { useState, useEffect } from 'react';
import { IoChevronForwardOutline } from 'react-icons/io5';
import ApplicantModal from './ApplicantModal';
import { GET } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';

const formatShortDate = (dateStr) => {
    if (!dateStr) return '-';
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
    });
};

const mapRecentRegistration = (item) => ({
    id: item?.id,
    name: item?.fullName || item?.user?.name || '-',
    phone: item?.phoneNumber || item?.user?.phone || 'Not provided',
    email: item?.email || item?.user?.email || '-',
    message: item?.notes || item?.event?.title || '-',
    date: formatShortDate(item?.registeredAt || item?.createdAt),
});

const RecentPlayerActivity = () => {
    const [selected, setSelected] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 5;

    const openModal = (player) => setSelected(player);
    const closeModal = () => setSelected(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await GET(ENDPOINT.EVENTS.MY_DASHBOARD);
                const data = response?.data?.data || {};
                const registrations = Array.isArray(data?.recentRegistrations) 
                    ? data.recentRegistrations.map(mapRecentRegistration)
                    : [];
                setPlayers(registrations);
            } catch (err) {
                console.error("Error fetching player activity:", err);
                setError("Failed to load player activity.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalPages = Math.max(1, Math.ceil(players.length / perPage));
    const startIdx = (page - 1) * perPage;
    const paginatedPlayers = players.slice(startIdx, startIdx + perPage);

    return (
        <div className="">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Player Activity</h1>
            </div>

            {/* Main Content Area */}
            <div className="overflow-hidden">
                {loading && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-sm text-[#676767]">Loading player activity...</p>
                    </div>
                )}
                {!loading && error && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}
                {!loading && !error && players.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-sm text-[#676767]">No recent player activity found.</p>
                    </div>
                )}

                {!loading && !error && players.length > 0 && (
                    <>
                        {/* Mobile Card View */}
                        <div className="block md:hidden space-y-3">
                            {paginatedPlayers.map((player, idx) => (
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
                                    {paginatedPlayers.map((player, idx) => (
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
                                Showing {startIdx + 1} to {Math.min(startIdx + perPage, players.length)} of {players.length} results
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-5 py-2 text-sm font-medium border rounded-lg transition-colors focus:outline-none ${
                                        page === 1
                                            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'text-[#0f766e] bg-white border-[#0f766e] hover:bg-teal-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-5 py-2 text-sm font-medium border rounded-lg transition-colors focus:outline-none ${
                                        page === totalPages
                                            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                            : 'text-[#0f766e] bg-white border-[#0f766e] hover:bg-teal-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <ApplicantModal applicant={selected} onClose={closeModal} />
            </div>
        </div>
    );
};

export default RecentPlayerActivity;
