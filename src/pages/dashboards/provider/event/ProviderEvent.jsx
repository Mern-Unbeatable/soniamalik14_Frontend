// import React, { useMemo, useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   AlertTriangle,
//   Calendar,
//   MapPin,
//   Pencil,
//   Plus,
//   Search,
//   Trash2,
//   X,
// } from 'lucide-react';
// import EventModal from '../../../../components/ui/EventModal';
// import Pagination from '../../../../components/ui/Pagination';
// import { deleteOrganizerEvent, fetchProviderEvents } from '../../../../features/events/eventsAPI';
// import {
//   selectDeleteOrganizerEventLoading,
//   selectProviderEvents,
//   selectProviderEventsLoading,
// } from '../../../../features/events/eventsSlice';

// const formatDateLabel = (value) => {
//   if (!value) return 'Date not set';
//   const parsed = new Date(value);
//   if (Number.isNaN(parsed.getTime())) return value;
//   return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
// };

// const ProviderEvent = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const restoredFilter = location.state?.filter;
//   const restoredPage = location.state?.currentPage;

//   const reduxEvents = useSelector(selectProviderEvents);
//   const isLoading = useSelector(selectProviderEventsLoading);
//   const isDeleteLoading = useSelector(selectDeleteOrganizerEventLoading);

//   const [page, setPage] = useState(Number.isInteger(restoredPage) && restoredPage > 0 ? restoredPage : 1);
//   const [filter, setFilter] = useState({
//     status:
//       restoredFilter && ['All', 'Approved', 'Pending'].includes(restoredFilter.status)
//         ? restoredFilter.status
//         : 'All',
//     query: typeof restoredFilter?.query === 'string' ? restoredFilter.query : '',
//   });

//   const [editingEvent, setEditingEvent] = useState(null);
//   const [eventToDelete, setEventToDelete] = useState(null);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchProviderEvents());
//   }, [dispatch]);

//   const events = useMemo(() => (Array.isArray(reduxEvents) ? reduxEvents : []), [reduxEvents]);

//   const perPage = 9;
//   const statusOptions = ['All', 'Approved', 'Pending'];

//   const filtered = useMemo(() => {
//     const q = filter.query.trim().toLowerCase();
//     return events.filter((ev) => {
//       const eventStatus = String(ev?.status || '').toLowerCase();
//       const filterStatus = String(filter.status || '').toLowerCase();
//       const statusMatch = filter.status === 'All' || eventStatus === filterStatus;
//       const queryMatch =
//         !q ||
//         String(ev?.title || '').toLowerCase().includes(q) ||
//         (ev.location || '').toLowerCase().includes(q) ||
//         (ev.venue?.name || '').toLowerCase().includes(q);
//       return statusMatch && queryMatch;
//     });
//   }, [events, filter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//   const safePage = Math.min(page, totalPages);

//   const paged = useMemo(() => {
//     const start = (safePage - 1) * perPage;
//     return filtered.slice(start, start + perPage);
//   }, [filtered, safePage]);

//   const openCreateModal = () => {
//     setIsCreateOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!eventToDelete) return;

//     const targetId = eventToDelete.id;
//     const action = await dispatch(deleteOrganizerEvent(targetId));

//     if (deleteOrganizerEvent.fulfilled.match(action)) {
//       setEventToDelete(null);
//       dispatch(fetchProviderEvents());
//     }
//   };

//   return (
//     <div className="dashboardPy dashboardSpaceY">
//       <section className="  py-4">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold text-[#1D1D1D] md:text-3xl">Manage Your Events</h1>
          
//           </div>
//           <button
//             type="button"
//             onClick={openCreateModal}
//             className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d655d]"
//           >
//             <Plus className="h-4 w-4" />
//             Create Event
//           </button>
//         </div>
//       </section>

//       <section className="w-full max-w-4xl rounded-xl bg-secondary p-4">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center">
//           <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
//             <Search className="h-4 w-4 text-gray-400" />
//             <input
//               placeholder="Search by event name"
//               value={filter.query}
//               onChange={(e) => {
//                 setFilter((prev) => ({ ...prev, query: e.target.value }));
//                 setPage(1);
//               }}
//               className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none"
//             />
//           </div>

//           <div className="md:hidden">
//             <select
//               value={filter.status}
//               onChange={(e) => {
//                 setFilter((prev) => ({ ...prev, status: e.target.value }));
//                 setPage(1);
//               }}
//               className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm outline-none"
//             >
//               {statusOptions.map((status) => (
//                 <option key={status} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="hidden gap-2 md:flex">
//             {statusOptions.map((status) => (
//               <button
//                 key={status}
//                 type="button"
//                 className={`inline-flex items-center justify-center rounded-lg px-5 py-2 text-base font-medium transition ${
//                   status === filter.status
//                     ? 'bg-[#0F766E] text-white shadow-md'
//                     : 'bg-gray-100 text-[#1C1C1C] hover:bg-gray-200'
//                 }`}
//                 onClick={() => {
//                   setFilter((prev) => ({ ...prev, status }));
//                   setPage(1);
//                 }}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {isLoading ? (
//         <div className="rounded-xl bg-white py-20 text-center shadow-sm">
//           <div className="mb-2 text-lg text-gray-500">Loading events...</div>
//         </div>
//       ) : paged.length === 0 ? (
//         <div className="rounded-xl bg-white py-20 text-center shadow-sm">
//           <div className="mb-2 text-lg text-gray-500">No events found</div>
//           <p className="text-base text-gray-400">Try changing the filters or create a new event.</p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//             {paged.map((item) => {
//               const isPending = String(item.status || '').toLowerCase() === 'pending';

//               return (
//                 <article
//                   key={item.id}
//                   onClick={() =>
//                     navigate(`/provider/event/${item.id}`, {
//                       state: { item, from: 'event', filter, currentPage: safePage },
//                     })
//                   }
//                   className="cursor-pointer rounded-lg border border-[#B5D5D2] bg-white p-4 shadow-sm"
//                 >
//                   <div className="relative">
//                     <span
//                       className={`absolute left-3 top-3 z-10 rounded-md px-3 py-1 text-sm font-medium ${
//                         isPending
//                           ? 'border border-[#FFDAB9] bg-[#FFDAB9] text-[#FF7700]'
//                           : 'border border-[#B5D5D2] bg-[#E9F7F5] text-[#0F766E]'
//                       }`}
//                     >
//                       {item.status}
//                     </span>

//                     <div className="mb-4 h-44 overflow-hidden rounded-md bg-gray-200">
//                       {item.image ? (
//                         <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
//                       ) : (
//                         <div className="flex h-full items-center justify-center text-sm text-gray-500">Image</div>
//                       )}
//                     </div>
//                   </div>

//                   <h3 className="mb-2 min-h-12 text-lg font-semibold text-[#282828]">{item.title}</h3>

//                   <div className="mb-3 space-y-2 text-base text-[#363636]">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       <span>{formatDateLabel(item.date || item.startDate)}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MapPin className="h-4 w-4" />
//                       <span>{item.location || item.fullAddress || item.venue?.name || 'Location not set'}</span>
//                     </div>
//                   </div>

//                   <div className="mt-2 flex gap-3" onClick={(e) => e.stopPropagation()}>
//                     <button
//                       type="button"
//                       onClick={() => setEditingEvent(item)}
//                       className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0d655d]"
//                     >
//                       <Pencil className="h-4 w-4" /> Edit
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setEventToDelete(item)}
//                       className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg border border-[#0F766E] bg-[#B5D5D2] px-3 py-2 text-sm font-medium text-[#0E6B64] transition hover:bg-[#a0c4c1]"
//                     >
//                       <Trash2 className="h-4 w-4" /> Delete
//                     </button>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           <Pagination page={safePage} total={totalPages} onChange={(p) => setPage(p)} />
//         </>
//       )}

//       <EventModal
//         isOpen={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         mode="create"
//         useOrganizerApi
//         onSuccess={() => {
//           dispatch(fetchProviderEvents());
//         }}
//       />

//       <EventModal
//         isOpen={Boolean(editingEvent)}
//         onClose={() => setEditingEvent(null)}
//         initialData={editingEvent}
//         mode="edit"
//         useOrganizerApi
//         onSuccess={() => {
//           setEditingEvent(null);
//           dispatch(fetchProviderEvents());
//         }}
//       />

//       {eventToDelete && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//           onMouseDown={(e) => {
//             if (e.target === e.currentTarget) setEventToDelete(null);
//           }}
//         >
//           <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-gray-200 p-4">
//               <h2 className="text-xl font-semibold text-gray-900">Delete Event</h2>
//               <button
//                 type="button"
//                 onClick={() => setEventToDelete(null)}
//                 className="rounded-full bg-[#D9D9D9] p-1 text-black transition-colors hover:bg-gray-300"
//                 aria-label="Close"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="flex items-start gap-4">
//                 <AlertTriangle className="h-6 w-6 text-red-600" />
//                 <p className="text-base text-gray-700">
//                   Are you sure you want to delete this event? This action cannot be undone.
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3 border-t border-gray-200 p-4">
//               <button
//                 type="button"
//                 onClick={() => setEventToDelete(null)}
//                 className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-base font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={confirmDelete}
//                 disabled={isDeleteLoading}
//                 className="flex-1 rounded-lg bg-red-600 py-2 text-base font-medium text-white transition hover:bg-red-700"
//               >
//                 {isDeleteLoading ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProviderEvent;


import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import EventModal from '../../../../components/ui/EventModal';
import CreateRecruitmentModal from '../../../../components/ui/CreateRecruitmentModal';
import Pagination from '../../../../components/ui/Pagination';
import { deleteOrganizerEvent, fetchProviderEvents } from '../../../../features/events/eventsAPI';
import {
  selectDeleteOrganizerEventLoading,
  selectProviderEvents,
  selectProviderEventsLoading,
} from '../../../../features/events/eventsSlice';

const formatDateLabel = (value) => {
  if (!value) return 'Date not set';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const normalizeStatus = (rawStatus) => {
  const s = String(rawStatus || '').toUpperCase();

  if (s.includes('PENDING')) return 'Pending';
  if (s.includes('APPROV')) return 'Approved';
  if (s.includes('REJECT')) return 'Rejected';
  if (s.includes('CANCEL')) return 'Cancelled';

  return s.charAt(0) + s.slice(1).toLowerCase();
};

const ProviderEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restoredFilter = location.state?.filter;
  const restoredPage = location.state?.currentPage;

  const reduxEvents = useSelector(selectProviderEvents);
  const isLoading = useSelector(selectProviderEventsLoading);
  const isDeleteLoading = useSelector(selectDeleteOrganizerEventLoading);

  const [page, setPage] = useState(Number.isInteger(restoredPage) && restoredPage > 0 ? restoredPage : 1);
  const [filter, setFilter] = useState({
    status:
      restoredFilter && ['All', 'Approved', 'Pending','Rejected'].includes(restoredFilter.status)
        ? restoredFilter.status
        : 'All',
    query: typeof restoredFilter?.query === 'string' ? restoredFilter.query : '',
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProviderEvents());
  }, [dispatch]);

  const events = useMemo(() => (Array.isArray(reduxEvents) ? reduxEvents : []), [reduxEvents]);

  const perPage = 9;
  const statusOptions = ['All', 'Approved', 'Pending',];

  const filtered = useMemo(() => {
    const q = filter.query.trim().toLowerCase();
    return events.filter((ev) => {
      const eventStatus = normalizeStatus(ev?.status); 
      const statusMatch = filter.status === 'All' || eventStatus === filter.status;
      const queryMatch =
        !q ||
        String(ev?.title || '').toLowerCase().includes(q) ||
        (ev.location || '').toLowerCase().includes(q) ||
        (ev.venue?.name || '').toLowerCase().includes(q);
      return statusMatch && queryMatch;
    });
  }, [events, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, safePage]);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    const targetId = eventToDelete.id;
    const action = await dispatch(deleteOrganizerEvent(targetId));

    if (deleteOrganizerEvent.fulfilled.match(action)) {
      setEventToDelete(null);
      dispatch(fetchProviderEvents());
    }
  };

  return (
    <div className="dashboardPy dashboardSpaceY">
      <section className="  py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1D1D1D] md:text-3xl">Manage Your Events</h1>
          
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d655d]"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </section>

      <section className="w-full max-w-4xl rounded-xl bg-secondary p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search by event name"
              value={filter.query}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, query: e.target.value }));
                setPage(1);
              }}
              className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="md:hidden">
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, status: e.target.value }));
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden gap-2 md:flex">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className={`inline-flex items-center justify-center rounded-lg px-5 py-2 text-base font-medium transition ${
                  status === filter.status
                    ? 'bg-[#0F766E] text-white shadow-md'
                    : 'bg-gray-100 text-[#1C1C1C] hover:bg-gray-200'
                }`}
                onClick={() => {
                  setFilter((prev) => ({ ...prev, status }));
                  setPage(1);
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-xl bg-white py-20 text-center shadow-sm">
          <div className="mb-2 text-lg text-gray-500">Loading events...</div>
        </div>
      ) : paged.length === 0 ? (
        <div className="rounded-xl bg-white py-20 text-center shadow-sm">
          <div className="mb-2 text-lg text-gray-500">No events found</div>
          <p className="text-base text-gray-400">Try changing the filters or create a new event.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {paged.map((item) => {
              const displayStatus = normalizeStatus(item.status); 
              const isPending = displayStatus === 'Pending';

              return (
                <article
                  key={item.id}
                  onClick={() =>
                    navigate(`/provider/event/${item.id}`, {
                      state: { item, from: 'event', filter, currentPage: safePage },
                    })
                  }
                  className="cursor-pointer rounded-lg border border-[#B5D5D2] bg-white p-4 shadow-sm"
                >
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-3 z-10 rounded-md px-3 py-1 text-sm font-medium ${
                        isPending
                          ? 'border border-[#FFDAB9] bg-[#FFDAB9] text-[#FF7700]'
                          : 'border border-[#B5D5D2] bg-[#E9F7F5] text-[#0F766E]'
                      }`}
                    >
                      {displayStatus}
                    </span>

                    <div className="mb-4 h-44 overflow-hidden rounded-md bg-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">Image</div>
                      )}
                    </div>
                  </div>

                  <h3 className="mb-2 min-h-12 text-lg font-semibold text-[#282828]">{item.title}</h3>

                  <div className="mb-3 space-y-2 text-base text-[#363636]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateLabel(item.date || item.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location || item.fullAddress || item.venue?.name || 'Location not set'}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setEditingEvent(item)}
                      className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0d655d]"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventToDelete(item)}
                      className="inline-flex w-1/2 items-center justify-center gap-2 rounded-lg border border-[#0F766E] bg-[#B5D5D2] px-3 py-2 text-sm font-medium text-[#0E6B64] transition hover:bg-[#a0c4c1]"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination page={safePage} total={totalPages} onChange={(p) => setPage(p)} />
        </>
      )}

      <EventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode="create"
        useOrganizerApi
        onSuccess={() => {
          dispatch(fetchProviderEvents());
        }}
        onSwitchToSession={() => setIsSessionModalOpen(true)}
      />

      <CreateRecruitmentModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        mode="create"
        onSuccess={() => {
          setIsSessionModalOpen(false);
        }}
        onSwitchToEvent={() => setIsCreateOpen(true)}
      />

      <EventModal
        isOpen={Boolean(editingEvent)}
        onClose={() => setEditingEvent(null)}
        initialData={editingEvent}
        mode="edit"
        useOrganizerApi
        onSuccess={() => {
          setEditingEvent(null);
          dispatch(fetchProviderEvents());
        }}
      />

      {eventToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEventToDelete(null);
          }}
        >
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-900">Delete Event</h2>
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="rounded-full bg-[#D9D9D9] p-1 text-black transition-colors hover:bg-gray-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <p className="text-base text-gray-700">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-200 p-4">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-2 text-base font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleteLoading}
                className="flex-1 rounded-lg bg-red-600 py-2 text-base font-medium text-white transition hover:bg-red-700"
              >
                {isDeleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderEvent;