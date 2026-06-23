// import React, { useEffect, useMemo, useState } from 'react';
// import { Eye } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import TablePagination from '../../../../components/ui/TablePagination';
// import { fetchEventAnalytics } from '../../../../features/events/eventsAPI';
// import {
//   selectAnalyticsError,
//   selectAnalyticsLoading,
//   selectEventAnalytics,
// } from '../../../../features/events/eventsSlice';

// const tabs = [
//   { id: 'all', label: 'All Event List' },
//   { id: 'complete', label: 'Complete Event' },
//   { id: 'upcoming', label: 'Upcoming Event' },
//   { id: 'pending', label: 'Pending Event' },
//   { id: 'cancel', label: 'Cancel Event' },
// ];

// const statusMeta = {
//   complete: {
//     label: 'Complete',
//     className: ' text-[#0F766E] ',
//   },
//   upcoming: {
//     label: 'Upcoming',
//     className: ' text-[#0F766E] ',
//   },
//   pending: {
//     label: 'Pending',
//     className: ' text-[#E36A00]',
//   },
//   cancel: {
//     label: 'Cancelled',
//     className: ' text-[#E90000] ',
//   },
// };

// const Insights = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const events = useSelector(selectEventAnalytics);
//   const loading = useSelector(selectAnalyticsLoading);
//   const error = useSelector(selectAnalyticsError);

//   const initialTab = useMemo(() => {
//     const tabFromState = location.state?.activeTab;
//     return tabs.some((tab) => tab.id === tabFromState) ? tabFromState : 'all';
//   }, [location.state]);

//   const initialPage = useMemo(() => {
//     const pageFromState = location.state?.currentPage;
//     return Number.isInteger(pageFromState) && pageFromState > 0 ? pageFromState : 1;
//   }, [location.state]);

//   const [activeTab, setActiveTab] = useState(initialTab);
//   const [currentPage, setCurrentPage] = useState(initialPage);

//   const perPage = 6;

//   useEffect(() => {
//     dispatch(fetchEventAnalytics());
//   }, [dispatch]);

//   const formatLabel = (value) => {
//     if (!value) return '-';
//     return String(value)
//       .toLowerCase()
//       .split('_')
//       .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//       .join(' ');
//   };

//   const formatDate = (dateValue) => {
//     if (!dateValue) return '-';
//     const parsed = new Date(dateValue);
//     if (Number.isNaN(parsed.getTime())) return dateValue;
//     return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
//   };

//   const normalizedInsights = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const source = Array.isArray(events) ? events : [];

//     return source.map((item) => {
//       const analyticsEntry = Array.isArray(item?.analytics) ? item.analytics[0] : item?.analytics;
//       const startDate = item?.startDate ? new Date(item.startDate) : null;
//       const endDate = item?.endDate ? new Date(item.endDate) : startDate;
//       const normalizedStatus = String(item?.status || '').trim().toLowerCase();

//       let status = 'upcoming';
//       if (normalizedStatus === 'pending') {
//         status = 'pending';
//       } else if (normalizedStatus === 'cancelled' || normalizedStatus === 'canceled') {
//         status = 'cancel';
//       } else if (normalizedStatus === 'completed' || (!!endDate && endDate < today)) {
//         status = 'complete';
//       }

//       return {
//         ...item,
//         coverImage: item?.image,
//         title: item?.title || '-',
//         type: formatLabel(item?.eventType || item?.type),
//         organizer: item?.organizerName || item?.organizer?.name || '-',
//         sport: item?.sportType || item?.sport || '-',
//         date: formatDate(item?.startDate || item?.date || item?.createdAt),
//         joined: Number(
//           analyticsEntry?.registrations ?? item?.currentParticipants ?? item?.registrations?.length ?? 0
//         ),
//         status,
//         eventType: formatLabel(item?.eventType || item?.type),
//         about: item?.description || '-',
//         sessionType: formatLabel(item?.eventType || item?.type),
//         suitableFor: Array.isArray(item?.suitableFor) && item.suitableFor.length > 0
//           ? item.suitableFor.join(', ')
//           : formatLabel(item?.skillLevel) || 'New to the sport',
//         bookings: [],
//         registerInterest: [],
//         enquiries: [],
//       };
//     });
//   }, [events]);

//   const filtered = useMemo(() => {
//     if (activeTab === 'all') return normalizedInsights;
//     return normalizedInsights.filter((item) => item.status === activeTab);
//   }, [activeTab, normalizedInsights]);

//   const totalResults = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
//   const safePage = Math.min(currentPage, totalPages);

//   const pageData = useMemo(() => {
//     const start = (safePage - 1) * perPage;
//     return filtered.slice(start, start + perPage);
//   }, [filtered, safePage]);

//   const onTabChange = (tabId) => {
//     setActiveTab(tabId);
//     setCurrentPage(1);
//   };

//   const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || 'All Event List';
//   const showStatusColumn = activeTab !== 'all';

//   const getStatusBadge = (status) => {
//     const statusConfig = statusMeta[status];
//     if (!statusConfig) return null;
//     return (
//       <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusConfig.className}`}>
//         {statusConfig.label}
//       </span>
//     );
//   };

//   return (
//     <div className="dashboardPy dashboardSpaceY">
//       <div className="border-b border-gray-200 overflow-x-auto">
//         <div className="flex gap-8 min-w-max px-1">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => onTabChange(tab.id)}
//               className={`py-3 text-base font-medium relative whitespace-nowrap ${
//                 activeTab === tab.id ? 'text-[#0F766E]' : 'text-[#676767] hover:text-[#1D1D1D]'
//               }`}
//             >
//               {tab.label}
//               {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F766E]" />}
//             </button>
//           ))}
//         </div>
//       </div>

//       <section className="rounded-lg border border-[#E2E8EA] bg-white">
//         <div className="border-b border-[#E2E8EA] px-5 py-4">
//           <h2 className="text-2xl font-semibold text-[#1D1D1D]">{activeTabLabel}</h2>
//         </div>

//         {loading && <div className="px-5 py-10 text-center text-gray-600">Loading insights...</div>}
//         {error && (
//           <div className="px-5 py-10 text-center text-red-600">
//             Error: {typeof error === 'string' ? error : error?.message || 'Failed to load insights'}
//           </div>
//         )}

//         {!loading && !error && totalResults === 0 && (
//           <div className="px-5 py-14 text-center text-gray-500">No events found for this tab.</div>
//         )}

//         {!loading && !error && totalResults > 0 && <div className="space-y-3 p-4 md:hidden">
//           {pageData.map((item) => (
//             <div key={item.id} className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
//               <div className="flex items-start justify-between gap-3">
//                 <h3 className="text-base font-semibold text-[#2F3B3A]">{item.title}</h3>
//                 {showStatusColumn && getStatusBadge(item.status)}
//               </div>
//               <div className="mt-3 space-y-1.5 text-sm text-[#4B5563]">
//                 <p>
//                   <span className="font-semibold text-[#1D1D1D]">Type:</span> {item.type}
//                 </p>
//                 <p>
//                   <span className="font-semibold text-[#1D1D1D]">Organizer:</span> {item.organizer}
//                 </p>
//                 <p>
//                   <span className="font-semibold text-[#1D1D1D]">Sport:</span> {item.sport}
//                 </p>
//                 <p>
//                   <span className="font-semibold text-[#1D1D1D]">Date:</span> {item.date}
//                 </p>
//                 <p>
//                   <span className="font-semibold text-[#1D1D1D]">Joined:</span>{' '}
//                   <span className="font-semibold text-[#0F766E]">{item.joined}</span>
//                 </p>
//               </div>
//               <div className="mt-3 border-t border-[#E2E8EA] pt-3">
//                 <Link
//                   to={`/provider/insights/${item.id}`}
//                   state={{ item, from: 'insights', activeTab, currentPage: safePage }}
//                   className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]"
//                 >
//                   <Eye className="h-4 w-4" /> Preview
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>}

//         {!loading && !error && totalResults > 0 && <div className="hidden overflow-x-auto md:block">
//           <table className="min-w-245 border-collapse xl:min-w-full">
//             <thead>
//               <tr className="bg-[#EAF2F1] text-left">
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Event Title</th>
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Type</th>
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Organizer</th>
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Sport</th>
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Date</th>
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Joined</th>
//                 {showStatusColumn && <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Status</th>}
//                 <th className="px-5 py-3 text-base font-medium text-[#1D1D1D] text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pageData.map((item) => (
//                 <tr key={item.id} className="border-b border-[#ECEFF1] last:border-b-0">
//                   <td className="px-5 py-4 text-base font-medium text-[#2F3B3A]">{item.title}</td>
//                   <td className="px-5 py-4 text-base text-[#4B5563]">{item.type}</td>
//                   <td className="px-5 py-4 text-base text-[#4B5563]">{item.organizer}</td>
//                   <td className="px-5 py-4 text-base text-[#4B5563]">{item.sport}</td>
//                   <td className="px-5 py-4 text-base text-[#4B5563]">{item.date}</td>
//                   <td className="px-5 py-4 text-base font-semibold text-[#0F766E]">{item.joined}</td>
//                   {showStatusColumn && <td className="px-5 py-4">{getStatusBadge(item.status)}</td>}
//                   <td className="px-5 py-4 text-center">
//                     <Link
//                       to={`/provider/insights/${item.id}`}
//                       state={{ item, from: 'insights', activeTab, currentPage: safePage }}
//                       className="inline-flex items-center justify-center text-[#2F3B3A] hover:text-[#0F766E]"
//                     >
//                       <Eye className="h-5 w-5" />
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>}

//         {!loading && !error && totalResults > 0 && (
//           <TablePagination
//             currentPage={safePage}
//             totalPages={totalPages}
//             totalResults={totalResults}
//             resultsPerPage={perPage}
//             onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
//             wrapperClass="px-5 py-4"
//             resultsTextClass="text-lg text-[#0F766E]"
//             buttonClass="rounded-xl text-base px-4 py-2"
//           />
//         )}
//       </section>
//     </div>
//   );
// };

// export default Insights;



import React, { useEffect, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TablePagination from '../../../../components/ui/TablePagination';
import { fetchEventAnalytics } from '../../../../features/events/eventsAPI';
import {
  selectAnalyticsError,
  selectAnalyticsLoading,
  selectEventAnalytics,
} from '../../../../features/events/eventsSlice';

const tabs = [
  { id: 'all', label: 'All Event List' },
  { id: 'complete', label: 'Complete Event' },
  { id: 'upcoming', label: 'Upcoming Event' },
  { id: 'pending', label: 'Pending Event' },
  { id: 'cancel', label: 'Cancel Event' },
];

const statusMeta = {
  complete: {
    label: 'Complete',
    className: ' text-[#0F766E] ',
  },
  upcoming: {
    label: 'Upcoming',
    className: ' text-[#0F766E] ',
  },
  pending: {
    label: 'Pending',
    className: ' text-[#E36A00]',
  },
  cancel: {
    label: 'Cancelled',
    className: ' text-[#E90000] ',
  },
};

const Insights = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const events = useSelector(selectEventAnalytics);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  const initialTab = useMemo(() => {
    const tabFromState = location.state?.activeTab;
    return tabs.some((tab) => tab.id === tabFromState) ? tabFromState : 'all';
  }, [location.state]);

  const initialPage = useMemo(() => {
    const pageFromState = location.state?.currentPage;
    return Number.isInteger(pageFromState) && pageFromState > 0 ? pageFromState : 1;
  }, [location.state]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const perPage = 10;

  useEffect(() => {
    dispatch(fetchEventAnalytics());
  }, [dispatch]);

  const formatLabel = (value) => {
    if (!value) return '-';
    return String(value)
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return dateValue;
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const resolveStatusKey = (rawStatus, endDate, today) => {
    const s = String(rawStatus || '').trim().toUpperCase();

    if (s.includes('PENDING')) return 'pending';
    if (s.includes('BANNED')) return 'cancel';
    if (s.includes('COMPLETE')) return 'complete';
    if (s.includes('UPCOMING') || s.includes('APPROV') || s.includes('ACTIVE')) {
      if (endDate && endDate < today) return 'complete';
      return 'upcoming';
    }

    if (endDate && endDate < today) return 'complete';
    return 'upcoming';
  };

  const normalizedInsights = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const source = Array.isArray(events) ? events : [];

    return source.map((item) => {
      const analyticsEntry = Array.isArray(item?.analytics) ? item.analytics[0] : item?.analytics;
      const startDate = item?.startDate ? new Date(item.startDate) : null;
      const endDate = item?.endDate ? new Date(item.endDate) : startDate;

      const status = resolveStatusKey(item?.status, endDate, today);

      return {
        ...item,
        coverImage: item?.image,
        title: item?.title || '-',
        type: formatLabel(item?.eventType || item?.type),
        organizer: item?.organizerName || item?.organizer?.name || '-',
        sport: item?.sportType || item?.sport || '-',
        date: formatDate(item?.startDate || item?.date || item?.createdAt),
        joined: Number(
          analyticsEntry?.registrations ?? item?.currentParticipants ?? item?.registrations?.length ?? 0
        ),
        status,
        eventType: formatLabel(item?.eventType || item?.type),
        about: item?.description || '-',
        sessionType: formatLabel(item?.eventType || item?.type),
        suitableFor: Array.isArray(item?.suitableFor) && item.suitableFor.length > 0
          ? item.suitableFor.join(', ')
          : formatLabel(item?.skillLevel) || 'New to the sport',
        bookings: [],
        registerInterest: [],
        enquiries: [],
      };
    });
  }, [events]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return normalizedInsights;
    return normalizedInsights.filter((item) => item.status === activeTab);
  }, [activeTab, normalizedInsights]);

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const pageData = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, safePage]);

  const onTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || 'All Event List';
  const showStatusColumn = activeTab !== 'all';

  const getStatusBadge = (status) => {
    const statusConfig = statusMeta[status];
    if (!statusConfig) return null;
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="dashboardPy dashboardSpaceY">
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-8 min-w-max px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-base font-medium relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#0F766E]' : 'text-[#676767] hover:text-[#1D1D1D]'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F766E]" />}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-lg border border-[#E2E8EA] bg-white">
        <div className="border-b border-[#E2E8EA] px-5 py-4">
          <h2 className="text-2xl font-semibold text-[#1D1D1D]">{activeTabLabel}</h2>
        </div>

        {loading && <div className="px-5 py-10 text-center text-gray-600">Loading insights...</div>}
        {error && (
          <div className="px-5 py-10 text-center text-red-600">
            Error: {typeof error === 'string' ? error : error?.message || 'Failed to load insights'}
          </div>
        )}

        {!loading && !error && totalResults === 0 && (
          <div className="px-5 py-14 text-center text-gray-500">No events found for this tab.</div>
        )}

        {!loading && !error && totalResults > 0 && <div className="space-y-3 p-4 md:hidden">
          {pageData.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-[#2F3B3A]">{item.title}</h3>
                {showStatusColumn && getStatusBadge(item.status)}
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-[#4B5563]">
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Type:</span> {item.type}
                </p>
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Organizer:</span> {item.organizer}
                </p>
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Sport:</span> {item.sport}
                </p>
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Date:</span> {item.date}
                </p>
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Joined:</span>{' '}
                  <span className="font-semibold text-[#0F766E]">{item.joined}</span>
                </p>
              </div>
              <div className="mt-3 border-t border-[#E2E8EA] pt-3">
                <Link
                  to={`/provider/insights/${item.id}`}
                  state={{ item, from: 'insights', activeTab, currentPage: safePage }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E]"
                >
                  <Eye className="h-4 w-4" /> Preview
                </Link>
              </div>
            </div>
          ))}
        </div>}

        {!loading && !error && totalResults > 0 && <div className="hidden overflow-x-auto md:block">
          <table className="min-w-245 border-collapse xl:min-w-full">
            <thead>
              <tr className="bg-[#EAF2F1] text-left">
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Event Title</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Type</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Organizer</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Sport</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Date</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Joined</th>
                {showStatusColumn && <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Status</th>}
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item) => (
                <tr key={item.id} className="border-b border-[#ECEFF1] last:border-b-0">
                  <td className="px-5 py-4 text-base font-medium text-[#2F3B3A]">{item.title}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{item.type}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{item.organizer}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{item.sport}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{item.date}</td>
                  <td className="px-5 py-4 text-base font-semibold text-[#0F766E]">{item.joined}</td>
                  {showStatusColumn && <td className="px-5 py-4">{getStatusBadge(item.status)}</td>}
                  <td className="px-5 py-4 text-center">
                    <Link
                      to={`/provider/insights/${item.id}`}
                      state={{ item, from: 'insights', activeTab, currentPage: safePage }}
                      className="inline-flex items-center justify-center text-[#2F3B3A] hover:text-[#0F766E]"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
        {!loading && !error && totalResults > 0 && (
          <TablePagination
            currentPage={safePage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={perPage}
            onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
            wrapperClass="px-5 py-4"
            resultsTextClass="text-lg text-[#0F766E]"
            buttonClass="rounded-xl text-base px-4 py-2"
          />
        )}
      </section>
    </div>
  );
};

export default Insights;