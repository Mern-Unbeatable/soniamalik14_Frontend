import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSection from './components/HeaderSection';
import SearchAndFilters from './components/SearchAndFilters';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import EmptyStateRow from './components/EmptyStateRow';
import Pagination from './components/Pagination';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { fetchSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesSlice';

const CSV_COLUMNS = [
  { label: 'Listing', key: 'listing' },
  { label: 'Date', key: 'date' },
  { label: 'Provider', key: 'provider' },
  { label: 'Provider Type', key: 'providerType' },
  { label: 'Category', key: 'category' },
  { label: 'Postcode', key: 'postcode' },
  { label: 'Status', key: 'status' },
];

const escapeCsvValue = (value) => {
  const normalizedValue = value == null ? '' : String(value);
  const escapedValue = normalizedValue.replace(/"/g, '""');
  return `"${escapedValue}"`;
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
};

const normalizeProviderType = (service) => {
  const providerRole = String(service?.provider?.role || '').toUpperCase();
  
  if (providerRole === 'COACH') {
    return 'Sport Providers';
  }
  if (providerRole === 'PROVIDER') {
    return 'Service Provider';
  }

  const providerTypeValues = Array.isArray(service?.providerType)
    ? service.providerType.map((entry) => String(entry || '').toLowerCase())
    : [];

  const looksLikeSportProvider =
    providerTypeValues.some((entry) =>
      ['coach', 'trainer', 'conditioning', 'football', 'tennis', 'cricket', 'sports'].some(
        (keyword) => entry.includes(keyword)
      )
    );

  return looksLikeSportProvider ? 'Sport Providers' : 'Service Provider';
};

const normalizeStatus = (service) => {
  if (service?.bannedAt || service?.bannedReason) return 'Banned';
  if (service?.isFeatured) return 'Featured';

  const normalized = String(service?.status || '')
    .trim()
    .toLowerCase();

  if (['active', 'approved', 'live'].includes(normalized)) return 'Live';
  if (['pending_approval', 'pending'].includes(normalized)) return 'Pending';
  if (['banned', 'blocked', 'rejected'].includes(normalized)) return 'Banned';

  return 'Pending';
};

const mapServiceToRow = (service) => {
  const providerRole = String(service?.provider?.role || '').toUpperCase();
  let providerDisplay = service?.providerName || service?.provider?.name || 'N/A';
  if (providerRole === 'COACH') {
    providerDisplay = 'Sport Providers';
  } else if (providerRole === 'PROVIDER') {
    providerDisplay = 'Service Provider';
  }

  return {
    id: service?.id,
    listing:
      service?.listingHeadline ||
      service?.organizationName ||
      service?.providerName ||
      'Untitled Listing',
    date: formatDate(service?.createdAt || service?.updatedAt),
    rawDate: service?.createdAt || service?.updatedAt,
    provider: providerDisplay,
    providerType: normalizeProviderType(service),
    category: Array.isArray(service?.sports) && service.sports.length > 0 ? service.sports[0] : 'N/A',
    postcode: service?.postcode || 'N/A',
    status: normalizeStatus(service),
    isFeatured: !!service?.isFeatured,
    engagement: null,
  };
};

const ListingsManagement = () => {
  // Filter States
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const sportsCategories = useSelector(selectSportsCategories);

  useEffect(() => {
    dispatch(fetchSportsCategories());
  }, [dispatch]);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await GET(ENDPOINT.SERVICES.ADMIN_BY_PROVIDER_ROLE);
      // console.log('ListingsManagement admin response payload:', response);
      const payload = response?.data || response;
      const services = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];
      
      // console.log('ListingsManagement admin parsed services list:', services);

      setTableData(services.map(mapServiceToRow));
    } catch (err) {
      console.error('ListingsManagement admin fetch error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load listings');
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (active) {
      loadListings();
    }

    return () => {
      active = false;
    };
  }, [loadListings]);

  // Get unique categories and statuses for the dropdowns
  const uniqueSports = useMemo(() => {
    if (sportsCategories && sportsCategories.length > 0) {
      return ['All Sports', ...sportsCategories.map(c => c.name).filter(Boolean)];
    }
    return [
      'All Sports',
      ...Array.from(new Set(tableData.map((item) => item.category))),
    ];
  }, [sportsCategories, tableData]);
  const uniqueStatuses = ['All Status', 'Featured', 'Pending', 'Live', 'Banned'];

  // Filter Logic
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      // 1. Tab Filter
      const matchesTab = activeTab === 'All' || item.providerType === activeTab;

      // 2. Search Filter (checks listing name, provider name, and category)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.listing.toLowerCase().includes(searchLower) ||
        item.provider.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower);

      // 3. Dropdown Filters
      const matchesSport = selectedSport === 'All Sports' || item.category === selectedSport;
      const matchesStatus = selectedStatus === 'All Status' || item.status === selectedStatus;

      // 4. Date Filter
      let matchesDate = true;
      if (fromDate || toDate) {
        const itemTime = item.rawDate ? new Date(item.rawDate).getTime() : 0;
        if (itemTime) {
          if (fromDate) {
            const fromTime = new Date(`${fromDate}T00:00:00`).getTime();
            matchesDate = matchesDate && itemTime >= fromTime;
          }
          if (toDate) {
            const toTime = new Date(`${toDate}T23:59:59`).getTime();
            matchesDate = matchesDate && itemTime <= toTime;
          }
        } else {
          matchesDate = false;
        }
      }

      return matchesTab && matchesSearch && matchesSport && matchesStatus && matchesDate;
    });
  }, [activeTab, searchQuery, selectedSport, selectedStatus, fromDate, toDate, tableData]);

  const handleExportCsv = useCallback(() => {
    if (!filteredData.length) return;

    const headerRow = CSV_COLUMNS.map((column) => escapeCsvValue(column.label)).join(',');
    const dataRows = filteredData.map((row) =>
      CSV_COLUMNS.map((column) => escapeCsvValue(row[column.key])).join(',')
    );
    const csvContent = [headerRow, ...dataRows].join('\n');
    const csvBlob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });

    const fileName = `listings-${new Date().toISOString().slice(0, 10)}.csv`;
    const blobUrl = URL.createObjectURL(csvBlob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.setAttribute('download', fileName);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
  }, [filteredData]);

  if (loading) {
    return (
      <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner label="" containerClassName="py-0" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
        <div className="p-6 text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
      <div className="">
        {/* Header Section */}
        <HeaderSection onExportCsv={handleExportCsv} isExportDisabled={!filteredData.length} />

        {/* Main Content Area */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Search and Filters */}
          <SearchAndFilters
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            uniqueSports={uniqueSports}
            uniqueStatuses={uniqueStatuses}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <TableHeader />
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <TableRow key={row.id} row={row} onActionDone={loadListings} />
                  ))
                ) : (
                  <EmptyStateRow />
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination filteredDataLength={filteredData.length} />
        </div>
      </div>
    </div>
  );
};

export default ListingsManagement;
