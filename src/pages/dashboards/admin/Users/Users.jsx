import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import FilterSection from './components/FilterSection';
import PlayersTable from './components/PlayersTable';
import SportProvidersTable from './components/SportProvidersTable';
import ServiceProvidersTable from './components/ServiceProvidersTable';
import TabsSection from './components/TabsSection';
import PaginationSection from './components/PaginationSection';
import SuspendModal from './components/SuspendModal';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import {
  fetchAllUsers,
  fetchSuspendedUsers,
  suspendUser,
  unsuspendUser,
  selectPlayerUsers,
  selectCoachUsers,
  selectProviderUsers,
  selectUsersLoading,
  selectSuspendedUsers,
  selectSuspendedLoading,
  selectPagination,
} from '../../../../features/users/usersSlice';
import { fetchSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesSlice';

const Users = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('players');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const sportsCategories = useSelector(selectSportsCategories);

  useEffect(() => {
    dispatch(fetchSportsCategories());
  }, [dispatch]);

  const currentRole = useMemo(() => {
    if (activeTab === 'players') return 'USER';
    if (activeTab === 'sportProviders') return 'COACH';
    return 'PROVIDER';
  }, [activeTab]);

  // Redux Selectors
  const playersData = useSelector(selectPlayerUsers);
  const sportProvidersData = useSelector(selectCoachUsers);
  const serviceProvidersData = useSelector(selectProviderUsers);
  const isLoading = useSelector(selectUsersLoading);

  // Fetch users depending on subtab
  const suspendedData = useSelector(selectSuspendedUsers);
  const suspendedLoading = useSelector(selectSuspendedLoading);
  const pagination = useSelector(selectPagination);

  useEffect(() => {
    let request;

    if (activeSubTab === 'suspended') {
      request = dispatch(fetchSuspendedUsers({ page, limit, filters: { role: currentRole } }));
    } else {
      request = dispatch(fetchAllUsers({ page, limit, filters: { role: currentRole } }));
    }

    return () => {
      request?.abort?.();
    };
  }, [dispatch, activeSubTab, page, limit, currentRole]);

  const reloadCurrentUsers = useCallback(async () => {
    if (activeSubTab === 'suspended') {
      await dispatch(fetchSuspendedUsers({ page, limit, filters: { role: currentRole } }));
      return;
    }

    await dispatch(fetchAllUsers({ page, limit, filters: { role: currentRole } }));
  }, [activeSubTab, currentRole, dispatch, limit, page]);

  // Modal handlers
  const handleOpenSuspendModal = async (userId, status) => {
    const normalizedStatus = String(status || '').toUpperCase();

    if (normalizedStatus === 'SUSPENDED') {
      try {
        const response = await dispatch(unsuspendUser({ userId })).unwrap();
        if (response?.message) {
          toast.success(response.message);
        }
        await reloadCurrentUsers();
      } catch (error) {
        console.error('Failed to reinstate user:', error);
      }
      return;
    }

    setSelectedUserId(userId);
    setIsSuspendModalOpen(true);
  };

  const handleCloseSuspendModal = () => {
    setIsSuspendModalOpen(false);
    setSelectedUserId(null);
  };

  const handleSubmitSuspend = async (userId, reason) => {
    try {
      const response = await dispatch(suspendUser({ userId, reason })).unwrap();
      if (response?.message) {
        toast.success(response.message);
      }
      await reloadCurrentUsers();
      handleCloseSuspendModal();
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const formatDateValue = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
  };

  const mapSportProviderRows = (rows = []) => {
    return rows.map((row) => {
      const contactName = [row?.firstName, row?.lastName].filter(Boolean).join(' ').trim();
      return {
        id: row?.id,
        businessName: row?.organizationName || row?.name || '-',
        contactName: contactName || row?.name || '-',
        email: row?.email || '-',
        postcode: row?.postcode || '-',
        sport:
          Array.isArray(row?.sportsOffered) && row.sportsOffered.length
            ? row.sportsOffered.join(', ')
            : '-',
        joined: formatDateValue(row?.createdAt),
        listingsCount: row?.listingsCount ?? 0,
        eventsCount: row?.eventsCount ?? 0,
        interestReceived: row?.interestReceived ?? 0,
        externalLinkClicks: row?.externalLinkClicks ?? 0,
        avgResponseTime: row?.avgResponseTime || '-',
        status: row?.status || '-',
      };
    });
  };

  const mapPlayerRows = (rows = []) => {
    return rows.map((row) => ({
      id: row?.id,
      name:
        row?.displayName ||
        row?.name ||
        [row?.firstName, row?.lastName].filter(Boolean).join(' ') ||
        '-',
      email: row?.email || '-',
      postcode: row?.postcode || '-',
      sport:
        Array.isArray(row?.sportsInterests) && row.sportsInterests.length
          ? row.sportsInterests.join(', ')
          : '-',
      joined: formatDateValue(row?.createdAt),
      lastLogin: formatDateValue(row?.lastLogin),
      events: row?.eventsCount ?? 0,
      interest: row?.interestCount ?? 0,
      status: row?.status || '-',
    }));
  };

  const mapServiceProviderRows = (rows = []) => {
    return rows.map((row) => ({
      id: row?.id,
      providerName: row?.organizationName || row?.name || '-',
      email: row?.email || '-',
      postcode: row?.postcode || '-',
      sport:
        Array.isArray(row?.serviceTypes) && row.serviceTypes.length
          ? row.serviceTypes.join(', ')
          : '-',
      joined: formatDateValue(row?.createdAt),
      lastLogin: formatDateValue(row?.lastLogin),
      phone: row?.phone || '-',
      organization: row?.organizationName || row?.name || '-',
      status: row?.status || '-',
    }));
  };

  const escapeCsvValue = (value) => {
    const normalized = value === null || value === undefined ? '' : String(value);
    const escaped = normalized.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const currentTableData = useMemo(() => {
    const isSuspendedView = activeSubTab === 'suspended';
    let rawList = [];

    if (activeTab === 'players') {
      rawList = isSuspendedView ? (suspendedData || []) : (playersData || []);
    } else if (activeTab === 'sportProviders') {
      rawList = isSuspendedView ? (suspendedData || []) : (sportProvidersData || []);
    } else if (activeTab === 'serviceProviders') {
      rawList = isSuspendedView ? (suspendedData || []) : (serviceProvidersData || []);
    }

    if (fromDate || toDate) {
      rawList = rawList.filter((row) => {
        const rowTime = row?.createdAt ? new Date(row.createdAt).getTime() : 0;
        if (!rowTime) return false;

        let matches = true;
        if (fromDate) {
          const fromTime = new Date(`${fromDate}T00:00:00`).getTime();
          matches = matches && rowTime >= fromTime;
        }
        if (toDate) {
          const toTime = new Date(`${toDate}T23:59:59`).getTime();
          matches = matches && rowTime <= toTime;
        }
        return matches;
      });
    }

    if (selectedSport && selectedSport !== 'All Sports') {
      rawList = rawList.filter((row) => {
        const interests = Array.isArray(row?.sportsInterests) ? row.sportsInterests : [];
        const offered = Array.isArray(row?.sportsOffered) ? row.sportsOffered : [];
        const types = Array.isArray(row?.serviceTypes) ? row.serviceTypes : [];
        const allSports = [...interests, ...offered, ...types].map(s => String(s || '').toLowerCase());
        return allSports.includes(selectedSport.toLowerCase());
      });
    }

    if (selectedStatus && selectedStatus !== 'All Status') {
      rawList = rawList.filter((row) => {
        return String(row?.status || '').trim().toLowerCase() === selectedStatus.trim().toLowerCase();
      });
    }

    if (activeTab === 'players') {
      return mapPlayerRows(rawList);
    }
    if (activeTab === 'sportProviders') {
      return mapSportProviderRows(rawList);
    }
    if (activeTab === 'serviceProviders') {
      return mapServiceProviderRows(rawList);
    }

    return [];
  }, [
    activeSubTab,
    activeTab,
    playersData,
    serviceProvidersData,
    sportProvidersData,
    suspendedData,
    fromDate,
    toDate,
    selectedSport,
    selectedStatus,
  ]);

  const getExportConfig = () => {
    if (activeTab === 'players') {
      return {
        filePrefix: 'players',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'postcode', label: 'Postcode' },
          { key: 'sport', label: 'Sports selected' },
          { key: 'joined', label: 'Joined' },
          { key: 'lastLogin', label: 'Last login' },
          { key: 'events', label: 'Events attended' },
          { key: 'interest', label: 'Register interest' },
          { key: 'status', label: 'Status' },
        ],
      };
    }

    if (activeTab === 'sportProviders') {
      return {
        filePrefix: 'sport-providers',
        columns: [
          { key: 'businessName', label: 'Business name' },
          { key: 'contactName', label: 'Contact name' },
          { key: 'email', label: 'Email' },
          { key: 'postcode', label: 'Postcode' },
          { key: 'sport', label: 'Sport' },
          { key: 'joined', label: 'Joined' },
          { key: 'listingsCount', label: 'Listings count' },
          { key: 'eventsCount', label: 'Events count' },
          { key: 'interestReceived', label: 'Interest received' },
          { key: 'externalLinkClicks', label: 'External link clicks received' },
          { key: 'avgResponseTime', label: 'Average response time' },
          { key: 'status', label: 'Status' },
        ],
      };
    }

    return {
      filePrefix: 'service-providers',
      columns: [
        { key: 'providerName', label: 'Provider Name' },
        { key: 'email', label: 'Email' },
        { key: 'postcode', label: 'Postcode' },
        { key: 'sport', label: 'Sports selected' },
        { key: 'joined', label: 'Joined' },
        { key: 'lastLogin', label: 'Last login' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'organization', label: 'Organization Name' },
        { key: 'status', label: 'Status' },
      ],
    };
  };

  const handleExportCsv = () => {
    const rows = currentTableData;
    if (!rows.length) {
      toast.info('No table data to export');
      return;
    }

    const { filePrefix, columns } = getExportConfig();
    const headerLine = columns.map((column) => escapeCsvValue(column.label)).join(',');
    const dataLines = rows.map((row) =>
      columns.map((column) => escapeCsvValue(row?.[column.key])).join(',')
    );

    const csvContent = [headerLine, ...dataLines].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const subTabSuffix = activeSubTab === 'suspended' ? 'suspended' : 'all';
    const fileName = `${filePrefix}-${subTabSuffix}-page-${page}.csv`;

    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const renderTableContent = () => {
    if (isLoading || suspendedLoading) {
      return <LoadingSpinner label="Loading users..." containerClassName="py-12" />;
    }

    if (!currentTableData || currentTableData.length === 0) {
      return (
        <div className="py-12 text-center text-base font-medium text-gray-500 border border-dashed border-gray-200 rounded-lg">
          No users found.
        </div>
      );
    }

    if (activeTab === 'players') {
      return (
        <PlayersTable
          data={currentTableData}
          activeSubTab={activeSubTab}
          onSuspend={handleOpenSuspendModal}
        />
      );
    }
    if (activeTab === 'sportProviders') {
      return (
        <SportProvidersTable
          data={currentTableData}
          activeSubTab={activeSubTab}
          onSuspend={handleOpenSuspendModal}
        />
      );
    }
    if (activeTab === 'serviceProviders') {
      return (
        <ServiceProvidersTable
          data={currentTableData}
          activeSubTab={activeSubTab}
          onSuspend={handleOpenSuspendModal}
        />
      );
    }
  };

  return (
    <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
      <div className="">
        {/* Header Section */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Users</h1>
            <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
              Manage platform identities and permissions.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="bg-btn-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-teal-700 sm:px-6 sm:py-3 sm:text-base"
          >
            <Download className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          {/* Tabs */}
          <TabsSection
            activeTab={activeTab}
            activeSubTab={activeSubTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setActiveSubTab('all');
              setPage(1);
            }}
            setActiveSubTab={(sub) => {
              setActiveSubTab(sub);
              setPage(1);
            }}
          />

          {/* Filters */}
          <FilterSection
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            sportsCategories={sportsCategories}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Dynamic Table */}
          {renderTableContent()}

          {/* Pagination */}
          <PaginationSection
            page={page}
            limit={limit}
            total={pagination?.total || suspendedData?.length || 0}
            totalPages={pagination?.totalPages || 1}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pagination?.totalPages || 1, p + 1))}
          />
        </div>
      </div>

      {/* Suspend Modal */}
      <SuspendModal
        isOpen={isSuspendModalOpen}
        onClose={handleCloseSuspendModal}
        onSubmit={handleSubmitSuspend}
        userId={selectedUserId}
      />
    </div>
  );
};

export default Users;
