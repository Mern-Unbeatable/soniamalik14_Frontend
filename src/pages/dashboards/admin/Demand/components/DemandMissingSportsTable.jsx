import React from 'react';
import LoadingSpinner from '../../../../../components/ui/LoadingSpinner';

const LEVEL_DISPLAY = {
    'NEW_TO_SPORT': 'New to Sport',
    'SOME_EXPERIENCE': 'Some Experience',
    'REGULAR_PLAYER': 'Regular Player',
    'COMPETITIVE': 'Competitive'
};

const PREFERENCE_DISPLAY = {
    'WOMEN_ONLY': 'Women Only',
    'MIXED': 'Mixed',
    'NO_PREFERENCE': 'No Preference'
};

const DAYS_DISPLAY = {
    'WEEKDAY_EVENINGS': 'Weekday evenings',
    'WEEKDAY_DAYTIME': 'Weekday daytime',
    'SATURDAY': 'Saturday',
    'SUNDAY': 'Sunday',
    'FLEXIBLE': 'Flexible'
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB');
    } catch (e) {
        return dateStr;
    }
};

const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
        case 'CONTACTED':
            return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'PENDING':
            return 'bg-amber-50 text-amber-700 border-amber-100';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-100';
    }
};

const DemandMissingSportsTable = ({ data, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner label="Loading missing sports requests..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-12 text-center text-red-600">
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[#E7F1F1] border-b border-gray-100">
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">User</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Requested Sport</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Level & Preference</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Preferred Days</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Help Start?</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Notes</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {data && data.length > 0 ? (
                    data.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {row.user?.avatar ? (
                                        <img src={row.user.avatar} alt={row.user.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-sm">
                                            {row.user?.name ? row.user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-base font-semibold text-gray-800">{row.user?.name || 'Unknown User'}</div>
                                        <div className="text-sm text-gray-500">{row.user?.email || row.userId || 'No email'}</div>
                                        {row.user?.phone && <div className="text-xs text-gray-400 mt-0.5">{row.user.phone}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1.5 text-xs font-semibold text-[#0f766e] bg-[#e2f3f1] rounded-full uppercase tracking-wider">
                                    {row.sportName === 'Other' ? row.otherSportName || 'Other' : row.sportName}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-base text-gray-700 font-medium">{LEVEL_DISPLAY[row.level] || row.level}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{PREFERENCE_DISPLAY[row.preference] || row.preference}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {row.preferredDays && row.preferredDays.length > 0 ? (
                                        row.preferredDays.map((day) => (
                                            <span key={day} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                                {DAYS_DISPLAY[day] || day}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400">None specified</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    row.wantToHelpStart 
                                        ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                        : 'bg-gray-50 text-gray-600 border border-gray-100'
                                }`}>
                                    {row.wantToHelpStart ? 'Yes, wants to help' : 'No, just play'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                                {formatDate(row.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wide border ${getStatusBadgeClass(row.status)}`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-base text-gray-600 max-w-[200px] truncate" title={row.adminNotes}>
                                {row.adminNotes || <span className="text-gray-400 italic">No notes</span>}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-base text-gray-500">No missing sports requests found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DemandMissingSportsTable;
