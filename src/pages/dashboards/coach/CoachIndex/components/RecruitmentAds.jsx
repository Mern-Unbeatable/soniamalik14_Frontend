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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Active Listings</h3>
        <button onClick={onPost} className="text-btn-primary font-medium">
          + Post New
        </button>
      </div>

      {loading && (
        <p className="text-secondary-text py-6 text-center text-sm">Loading listings...</p>
      )}

      {!loading && error && <p className="py-6 text-center text-sm text-red-500">{error}</p>}

      {!loading && !error && ads.length === 0 && (
        <p className="text-secondary-text py-6 text-center text-sm">No listings found.</p>
      )}

      {!loading && !error && ads.length > 0 && (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex flex-col gap-3 rounded-xl border border-[#EDEDED] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-medium">
                  {ad.listingHeadline || ad.organizationName || 'Untitled'}
                </h4>
                <p className="text-secondary-text mt-1 flex items-center gap-1 text-base">
                  <Users size={16} />
                  {ad._count?.bookings ?? 0} Bookings
                </p>
                <Link
                  to={`/coach/recruitment/${ad.id}`}
                  state={{ item: ad, from: 'dashboard' }}
                  className="text-btn-primary mt-2 inline-block text-base hover:underline"
                >
                  View Listing
                </Link>
              </div>
              <div className="shrink-0">
                <span
                  className={`inline-block rounded-lg px-3 py-1 text-sm font-semibold ${
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
