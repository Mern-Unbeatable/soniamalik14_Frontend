import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Users, X } from 'lucide-react';
import EventModal from '../../../components/ui/EventModal';
import CreateRecruitmentModal from '../../../components/ui/CreateRecruitmentModal';
import axiosInstance from '../../../services/axiosInstance';
import { GET } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';

const PlayerActivityModal = ({ open, onClose, player }) => {
  if (!open || !player) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-150 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <h2 className="text-2xl leading-8 font-semibold text-[#1D1D1D]">Player Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D5E2E1] text-[#000000] bg-[#D9D9D9] hover:text-[#1D1D1D]"
            aria-label="Close player details modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-2 overflow-y-auto px-5 pb-6 text-xl leading-8 text-[#1D1D1D]">
          <p className="text-lg  font-semibold">{player.name}</p>
          <p className=' text-base'>{player.phone}</p>
          <p className=" text-bas">{player.email}</p>
          <p className='text-base'> Date: {player.date}</p>
          <p className="pt-2 text-base leading-7 text-[#374151]">{player.message}</p>
        </div>
      </div>
    </div>
  );
};

const formatEventDate = (dateStr) => {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return { month: 'TBD', day: '--' };
  }

  return {
    month: parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(parsed.getDate()).padStart(2, '0'),
  };
};

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

const STATUS_STYLES = {
  ACTIVE: 'bg-[#E7F1F1] text-[#0F766E]',
  APPROVED: 'bg-[#E7F1F1] text-[#0F766E]',
  UPCOMING: 'bg-[#E7F1F1] text-[#0F766E]',
  ONGOING: 'bg-[#E7F1F1] text-[#0F766E]',
  PENDING_APPROVAL: 'bg-[#FFDAB9] text-[#FF7700]',
  PENDING: 'bg-[#FFDAB9] text-[#FF7700]',
  REJECTED: 'bg-[#FFE4E1] text-[#DC2626]',
};

const formatStatus = (status = '') =>
  status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [events, setEvents] = useState([]);
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  // Active Listings from API
  const [activeListings, setActiveListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);

  const fetchActiveListings = useCallback(async () => {
    try {
      setListingsLoading(true);
      setListingsError(null);
      const res = await axiosInstance.get('/api/services/provider/my', {
        params: { limit: 3, page: 1 },
      });
      setActiveListings((res?.data?.data ?? []).slice(0, 3));
    } catch (err) {
      setListingsError('Failed to load listings.');
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await fetchActiveListings();
    };
    load();
    return () => { cancelled = true; };
  }, [fetchActiveListings]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError(null);
      const response = await GET(ENDPOINT.EVENTS.MY_DASHBOARD);
      const data = response?.data?.data || {};
      setEvents(Array.isArray(data?.events) ? data.events : []);
      setRecentPlayers(
        (Array.isArray(data?.recentRegistrations) ? data.recentRegistrations : []).map(
          mapRecentRegistration
        )
      );
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setEvents([]);
      setRecentPlayers([]);
      setDashboardError('Failed to load dashboard data.');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(recentPlayers.length / perPage));

  const yourEvents = useMemo(
    () =>
      events.slice(0, 4).map((event) => {
        const dateParts = formatEventDate(event.startDate || event.date || event.createdAt);

        return {
          ...event,
          statusLabel: formatStatus(event.status),
          dateMonth: dateParts.month,
          dateDay: dateParts.day,
        };
      }),
    [events],
  );

  const pagedPlayers = useMemo(() => {
    const start = (page - 1) * perPage;
    return recentPlayers.slice(start, start + perPage);
  }, [page, recentPlayers]);

  const startResult = recentPlayers.length === 0 ? 0 : (page - 1) * perPage + 1;
  const endResult = Math.min(page * perPage, recentPlayers.length);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // After creating a new listing, re-fetch to keep the list fresh
  const handleServiceCreated = useCallback(async () => {
    await fetchActiveListings();
  }, [fetchActiveListings]);

  const handleEventCreated = async () => {
    await fetchDashboardData();
  };

  return (
    <div className="dashboardPy dashboardSpaceY">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl bg-white p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#121111]">Active Listings</h2>
            <button
              type="button"
              onClick={() => setServiceModalOpen(true)}
              className="inline-flex items-center gap-2 text-[32px] font-medium text-[#0F766E]"
            >
              <Plus className="h-4 w-4" />
              <span className="text-base">Post New</span>
            </button>
          </div>

          <div className="space-y-3">
            {listingsLoading && (
              <p className="py-6 text-center text-sm text-secondary-text">Loading listings...</p>
            )}
            {!listingsLoading && listingsError && (
              <p className="py-6 text-center text-sm text-red-500">{listingsError}</p>
            )}
            {!listingsLoading && !listingsError && activeListings.length === 0 && (
              <p className="py-6 text-center text-sm text-secondary-text">No listings found.</p>
            )}
            {!listingsLoading && !listingsError && activeListings.map((listing) => (
              <article key={listing.id} className="relative rounded-2xl border border-[#EDEDED] bg-white px-4 pt-4 pb-12 md:px-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base leading-tight font-medium text-[#373737]">
                    {listing.listingHeadline || listing.organizationName || 'Untitled'}
                  </h3>
                  <span
                    className={`rounded-md px-2 py-1.5 text-sm ${
                      STATUS_STYLES[listing.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {formatStatus(listing.status)}
                  </span>
                </div>

                <p className="inline-flex items-center gap-2 text-base text-sidebarLink py-2 md:py-0">
                  <Users className="h-3.4 w-3.4" />
                  <span>{listing._count?.bookings ?? 0} Bookings</span>
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/provider/add-listing/${listing.id}`, {
                      state: { item: listing, from: 'add-listing' },
                    })
                  }
                  className="absolute left-4 bottom-4 text-start text-base font-medium text-btn-primary hover:underline md:left-5"
                >
                  View Listing
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#121111]">Your Events</h2>
            <button
              type="button"
              onClick={() => setEventModalOpen(true)}
              className="inline-flex items-center gap-1 text-sm font-medium text-btn-primary"
            >
              <Plus className="h-4 w-4" />
              <span className='text-base'>Create Event</span>
            </button>
          </div>

          <div className="space-y-3">
            {dashboardLoading && (
              <p className="py-6 text-center text-sm text-secondary-text">Loading dashboard data...</p>
            )}
            {!dashboardLoading && dashboardError && (
              <p className="py-6 text-center text-sm text-red-500">{dashboardError}</p>
            )}
            {!dashboardLoading && !dashboardError && yourEvents.length === 0 && (
              <p className="py-6 text-center text-sm text-secondary-text">No events found.</p>
            )}
            {!dashboardLoading &&
              !dashboardError &&
              yourEvents.map((event) => (
                <article
                  key={event.id}
                  className="flex flex-col items-start justify-between gap-3 rounded-lg border border-gray-100 p-3 sm:flex-row sm:items-center md:p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-gray-100 bg-gray-50">
                      <span className="text-[10px] leading-none text-sidebarLink">{event.dateMonth}</span>
                      <span className="mt-1 text-sm font-semibold leading-none text-[#0F766E]">
                        {event.dateDay}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#373737] md:text-base">{event.title}</h3>
                      <p
                        className={`mt-0.5 text-sm ${
                          event.status === 'REJECTED'
                            ? 'text-[#DC2626]'
                            : event.status === 'PENDING' || event.status === 'PENDING_APPROVAL'
                              ? 'text-[#FF7700]'
                              : 'text-[#0F766E]'
                        }`}
                      >
                        {event.statusLabel}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/provider/event/${event.id}`, {
                        state: {
                          item: event,
                          from: 'event',
                          filter: { status: 'All', query: '' },
                          currentPage: 1,
                        },
                      })
                    }
                    className="w-full rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white sm:w-auto"
                  >
                    See Details
                  </button>
                </article>
              ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-4 text-3xl font-bold text-[#121111]">Recent Player Activity</h2>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          {dashboardLoading && (
            <p className="px-4 py-8 text-center text-sm text-secondary-text">Loading player activity...</p>
          )}
          {!dashboardLoading && dashboardError && (
            <p className="px-4 py-8 text-center text-sm text-red-500">{dashboardError}</p>
          )}
          {!dashboardLoading && !dashboardError && recentPlayers.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-secondary-text">No recent player activity found.</p>
          )}
          {!dashboardLoading && !dashboardError && recentPlayers.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
            <table className="min-w-245 w-full">
              <thead>
                <tr className="bg-[#E7F1F1]">
                  <th className="px-4 py-3 text-left text-base font-medium text-[#121111]">Player Name</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-[#121111]">Phone Number</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-[#121111]">Email</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-[#121111]">Message</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-[#121111]">Date</th>
                  <th className="px-4 py-3 text-left text-base font-medium text-[#121111]">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pagedPlayers.map((player) => (
                  <tr key={player.id} className="border-t border-gray-100">
                    <td className="px-4 py-4 text-sm font-medium text-[#373737]">{player.name}</td>
                    <td className="px-4 py-4 text-sm text-[#373737]">{player.phone}</td>
                    <td className="break-all px-4 py-4 text-sm text-[#373737]">{player.email}</td>
                    <td className="px-4 py-4 text-base text-[#373737]">{player.message}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-[#373737]">{player.date}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPlayer(player)}
                        className="inline-flex h-9 w-9 items-center justify-center  text-[#1D1D1D] "
                        aria-label={`Open details for ${player.name}`}
                      >
                        <ChevronRight className="h-5 w-5 text-[#121111]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

          {!dashboardLoading && !dashboardError && recentPlayers.length > 0 && (
            <div className="divide-y divide-gray-100 md:hidden">
              {pagedPlayers.map((player) => (
                <article key={player.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-[#121111]">{player.name}</h3>
                    <span className="text-xs text-sidebarLink">{player.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#373737]">{player.phone}</p>
                  <p className="break-all text-sm text-[#373737]">{player.email}</p>
                  <p className="mt-2 text-sm text-[#373737]">{player.message}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedPlayer(player)}
                    className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5E2E1] text-[#1D1D1D] hover:bg-[#EAF2F1]"
                    aria-label={`Open details for ${player.name}`}
                  >
                    <ChevronRight className="h-5 w-5 text-[#121111]" />
                  </button>
                </article>
              ))}
            </div>
          )}

          {!dashboardLoading && !dashboardError && recentPlayers.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row">
              <p className="text-sm font-medium text-[#0F766E]">
                Showing {startResult} to {endResult} of {recentPlayers.length} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-[#0F766E] px-4 py-1.5 text-sm text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-[#0F766E] px-4 py-1.5 text-sm text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <CreateRecruitmentModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        mode="create"
        onSuccess={handleServiceCreated}
      />

      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        mode="create"
        useOrganizerApi={true}
        onSuccess={handleEventCreated}
      />

      <PlayerActivityModal
        open={Boolean(selectedPlayer)}
        onClose={() => setSelectedPlayer(null)}
        player={selectedPlayer}
      />
    </div>
  );
};

export default ProviderDashboard;
