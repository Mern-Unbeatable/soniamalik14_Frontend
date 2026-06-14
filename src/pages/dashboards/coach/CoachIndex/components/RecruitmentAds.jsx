import { Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../../services/axiosInstance';

const STATUS_STYLES = {
    ACTIVE: 'bg-[#E7F1F1] text-[#0F766E]',
    APPROVED: 'bg-[#E7F1F1] text-[#0F766E]',
    PENDING_APPROVAL: 'bg-[#FFDAB9] text-[#FF7700]',
    PENDING: 'bg-[#FFDAB9] text-[#FF7700]',
    REJECTED: 'bg-[#FFE4E1] text-[#DC2626]',
};

const formatStatus = (status = '') =>
    status
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

const RecruitmentAds = ({ onPost }) => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchAds = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get('/api/services/provider/my', {
                    params: { limit: 3, page: 1 },
                });
                if (!cancelled) {
                    const items = response?.data?.data ?? [];
                    setAds(items.slice(0, 3));
                }
            } catch (err) {
                if (!cancelled) {
                    setError('Failed to load listings.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAds();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-2 md:p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Active Listings</h3>
                <button onClick={onPost} className="text-btn-primary font-medium">
                    + Post New
                </button>
            </div>

            {loading && (
                <p className="text-secondary-text text-sm text-center py-6">Loading listings...</p>
            )}

            {!loading && error && (
                <p className="text-red-500 text-sm text-center py-6">{error}</p>
            )}

            {!loading && !error && ads.length === 0 && (
                <p className="text-secondary-text text-sm text-center py-6">No listings found.</p>
            )}

            {!loading && !error && ads.length > 0 && (
                <div className="space-y-4">
                    {ads.map((ad) => (
                        <div
                            key={ad.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-[#EDEDED] rounded-xl p-4 gap-3"
                        >
                            <div className="min-w-0 flex-1">
                                <h4 className="font-medium truncate">{ad.listingHeadline || ad.organizationName || 'Untitled'}</h4>
                                <p className="text-base text-secondary-text mt-1 flex items-center gap-1">
                                    <Users size={16} />
                                    {ad._count?.bookings ?? 0} Bookings
                                </p>
                                <Link
                                    to={`/coach/recruitment/${ad.id}`}
                                    state={{ item: ad, from: 'dashboard' }}
                                    className="text-btn-primary text-base mt-2 inline-block hover:underline"
                                >
                                    View Listing
                                </Link>
                            </div>
                            <div className="shrink-0">
                                <span
                                    className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                                        STATUS_STYLES[ad.status] ?? 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {formatStatus(ad.status)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecruitmentAds;
