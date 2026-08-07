import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventHeaderSection from './components/EventHeaderSection';
import EventSearchAndFilters from './components/EventSearchAndFilters';
import EventTableHeader from './components/EventTableHeader';
import EventTableRow from './components/EventTableRow';
import EventEmptyState from './components/EventEmptyState';
import EventPagination from './components/EventPagination';
import { fetchAdminEvents } from '../../../../features/events/eventsAPI';
import {
  selectAdminEvents,
  selectAdminEventsError,
  selectAdminEventsLoading,
} from '../../../../features/events/eventsSlice';
import { fetchSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesSlice';

const normalizeEventsList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value.events)) return value.events;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.rows)) return value.rows;
  if (Array.isArray(value.items)) return value.items;
  return [];
};

const formatDate = (value) => {
  if (!value) return 'Date not set';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatStatus = (value) => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();

  if (['approved', 'live', 'active'].includes(normalized)) return 'Live';
  if (['pending', 'pending_approval', 'awaiting'].includes(normalized)) return 'Pending';
  if (['featured'].includes(normalized)) return 'Featured';
  if (['banned', 'blocked', 'rejected'].includes(normalized)) return 'Banned';
  if (['past', 'completed', 'ended'].includes(normalized)) return 'Past';

  return value ? String(value) : 'Pending';
};

const formatProviderName = (event) =>
  event?.provider ||
  event?.organizer?.name ||
  event?.organizerName ||
  event?.providerName ||
  'Provider not set';

const formatProviderSub = (event) =>
  event?.providerSub ||
  event?.organizer?.subtitle ||
  event?.providerSubtitle ||
  event?.organizerName ||
  '';

const formatSport = (event) =>
  event?.sport || event?.sportType || event?.category || 'Sport not set';

const extractPostcode = (address) => {
  if (!address) return 'N/A';
  // Regex matches UK Postcodes: e.g. SW11 4NJ, EC1A 1BB, W1A 0AX etc.
  const match = address.match(/[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}/i);
  return match ? match[0].toUpperCase() : 'N/A';
};

const formatPostcode = (event) =>
  event?.postcode || event?.zipCode || event?.postalCode || event?.venue?.postcode || extractPostcode(event?.fullAddress);

const formatEngagement = (event) => ({
  currentParticipants: event?.currentParticipants ?? 0,
  maxParticipants: event?.maxParticipants,
});

const resolveIsFeatured = (event) => {
  if (typeof event?.isFeatured === 'boolean') return event.isFeatured;
  const statusSource = event?.status || event?.approvalStatus || event?.eventStatus;
  return (
    String(statusSource || '')
      .trim()
      .toLowerCase() === 'featured'
  );
};

const Events = () => {
  const dispatch = useDispatch();
  const ITEMS_PER_PAGE = 10;
  // Filter States
  const [activeTab, setActiveTab] = useState('All Events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsData = useSelector(selectAdminEvents);
  const loading = useSelector(selectAdminEventsLoading);
  const error = useSelector(selectAdminEventsError);
  const errorMessage = useMemo(() => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (typeof error === 'object') return error?.message || 'Something went wrong';
    return String(error);
  }, [error]);

  const renderedEvents = useMemo(() => {
    return normalizeEventsList(eventsData).map((event) => ({
      id: event?.id,
      name: event?.name || event?.title || 'Untitled Event',
      date: formatDate(event?.date || event?.startDate || event?.eventDate),
      provider: formatProviderName(event),
      providerSub: formatProviderSub(event),
      sport: formatSport(event),
      postcode: formatPostcode(event),
      status: formatStatus(event?.status || event?.approvalStatus || event?.eventStatus),
      isFeatured: resolveIsFeatured(event),
      engagement: formatEngagement(event),
    }));
  }, [eventsData]);

  const sportsCategories = useSelector(selectSportsCategories);

  useEffect(() => {
    dispatch(fetchAdminEvents());
    dispatch(fetchSportsCategories());
  }, [dispatch]);

  const tabs = ['All Events', 'Pending', 'Featured', 'Live', 'Past', 'Banned'];

  // Get unique sports for the dropdown
  const uniqueSports = useMemo(() => {
    if (sportsCategories && sportsCategories.length > 0) {
      return ['All Sports', ...sportsCategories.map(c => c.name).filter(Boolean)];
    }
    return [
      'All Sports',
      ...Array.from(new Set(renderedEvents.map((item) => item.sport).filter(Boolean))),
    ];
  }, [sportsCategories, renderedEvents]);

  // Helper function to parse "DD/MM/YYYY" to a comparable Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    return renderedEvents.filter((event) => {
      // 1. Tab Filter
      const matchesTab =
        activeTab === 'All Events' ||
        (activeTab === 'Featured' ? event.isFeatured === true : event.status === activeTab);

      // 2. Search Filter
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        event.name.toLowerCase().includes(query) ||
        event.provider.toLowerCase().includes(query) ||
        (event.providerSub && event.providerSub.toLowerCase().includes(query)) ||
        event.sport.toLowerCase().includes(query) ||
        event.postcode.toLowerCase().includes(query);

      // 3. Sport Dropdown Filter
      const matchesSport = selectedSport === 'All Sports' || event.sport === selectedSport;

      // 4. Date Filters
      const eventDate = parseDate(event.date);
      const filterFromDate = fromDate ? new Date(fromDate) : null;
      const filterToDate = toDate ? new Date(toDate) : null;

      const matchesFromDate = !filterFromDate || (eventDate && eventDate >= filterFromDate);
      const matchesToDate = !filterToDate || (eventDate && eventDate <= filterToDate);

      return matchesTab && matchesSearch && matchesSport && matchesFromDate && matchesToDate;
    });
  }, [activeTab, searchQuery, selectedSport, fromDate, toDate, renderedEvents]);

  const totalResults = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const handleTabChange = (value) => {
    setCurrentPage(1);
    setActiveTab(value);
  };

  const handleSearchChange = (value) => {
    setCurrentPage(1);
    setSearchQuery(value);
  };

  const handleSportChange = (value) => {
    setCurrentPage(1);
    setSelectedSport(value);
  };

  const handleFromDateChange = (value) => {
    setCurrentPage(1);
    setFromDate(value);
  };

  const handleToDateChange = (value) => {
    setCurrentPage(1);
    setToDate(value);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, safeCurrentPage]);

  const handleExportCSV = () => {
    if (!filteredData || filteredData.length === 0) return;

    const headers = ['Event Name', 'Date', 'Provider', 'Sport', 'Postcode', 'Status', 'Is Featured'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(event => [
        `"${(event.name || '').replace(/"/g, '""')}"`,
        `"${(event.date || '')}"`,
        `"${(event.provider || '').replace(/"/g, '""')}"`,
        `"${(event.sport || '').replace(/"/g, '""')}"`,
        `"${(event.postcode || '').replace(/"/g, '""')}"`,
        `"${(event.status || '')}"`,
        event.isFeatured ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `events_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
      <div className="">
        {/* Header Section */}
        <EventHeaderSection onExport={handleExportCSV} />

        {/* Main Content Area */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Search and Filters */}
          <EventSearchAndFilters
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            selectedSport={selectedSport}
            setSelectedSport={handleSportChange}
            fromDate={fromDate}
            setFromDate={handleFromDateChange}
            toDate={toDate}
            setToDate={handleToDateChange}
            tabs={tabs}
            uniqueSports={uniqueSports}
          />

          {/* Table Area */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-600">
                Loading events from the backend...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">Error: {errorMessage}</div>
            ) : (
              <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
                <EventTableHeader />
                <tbody className="divide-y divide-gray-100 bg-white">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row) => <EventTableRow key={row.id} row={row} />)
                  ) : (
                    <EventEmptyState />
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <EventPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={ITEMS_PER_PAGE}
            totalResults={totalResults}
            onPrev={() => setCurrentPage((prev) => Math.max(1, Math.min(prev, totalPages) - 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(totalPages, Math.min(prev, totalPages) + 1))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
