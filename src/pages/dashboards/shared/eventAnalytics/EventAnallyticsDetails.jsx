import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAllEvents } from '../../../../features/events/eventsSlice';
import TablePagination from '../../../../components/ui/TablePagination';
import { GET, POST } from '../../../../services/httpMethods';
import SessionOverview from '../../provider/event/components/SessionOverview';
import VenueInformation from '../../provider/event/components/VenueInformation';
import ContactOrganiser from '../../provider/event/components/ContactOrganiser';

const getMapEmbedUrl = (event) => {
  const directMapLink = String(event?.googleMapLink || '').trim();
  const buildEmbed = (query) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  if (directMapLink) {
    try {
      const parsedUrl = new URL(directMapLink);
      const query = parsedUrl.searchParams.get('q');
      if (query) return buildEmbed(query);
    } catch {
      // Fall back to treating the value as a plain location query.
    }

    return buildEmbed(directMapLink);
  }

  const fallbackQuery = event?.fullAddress || event?.venue?.address || event?.venueName || '';
  if (!fallbackQuery) return '';
  return buildEmbed(fallbackQuery);
};

const fallbackEvent = {
  title: "Women's Open Football Training Camp",
  image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=600&fit=crop',
  eventType: 'Workshops & learning',
  description:
    'This training camp is designed exclusively for women footballers who want to improve their skills, fitness, and overall match performance. The session will focus on technical drills, tactical awareness, team coordination, and physical conditioning in a supportive and competitive environment.\n\nWhether you are preparing for upcoming matches or looking to sharpen your fundamentals, this camp provides professional guidance and structured training. Players will train under experienced coaches and get valuable feedback to help them grow confidently on the field.',
  sportType: 'Cricket',
  skillLevel: 'New to the sport',
  eventSubType: 'Recreational',
  venue: {
    name: 'Bashundhara turbo tough',
    address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
  },
  time: '10:00 - 12:00',
  organizer: { avatar: 'https://ui-avatars.com/api/?name=Coach&background=0D8ABC&color=fff' },
};

const DataTable = ({
  title,
  columns,
  rows,
  rawRows = [],
  withAction = false,
  rowsPerPage = 6,
  onAction,
}) => {
  const [page, setPage] = useState(1);

  const totalResults = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalResults);
  const currentRows = rows.slice(startIndex, endIndex);
  const actionLabel = columns[rows[0]?.length] || 'Action';

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
      <div className="border-b border-[#e5e7eb] px-5 py-3">
        <h3 className="text-[20px] leading-8 font-semibold text-black">{title}</h3>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-180">
          <thead>
            <tr className="bg-[#f7f8f9]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-base font-medium tracking-wide text-[#667085] uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => {
              const original = rawRows[startIndex + idx];
              return (
                <tr key={`${title}-${startIndex + idx}`} className="border-t border-[#f0f2f4]">
                  {row.map((cell, cellIdx) => (
                    <td
                      key={`${title}-${startIndex + idx}-${cellIdx}`}
                      className="px-5 py-3 text-base text-[#344054]"
                    >
                      {cell}
                    </td>
                  ))}
                  {withAction && (
                    <td className="flex px-12 py-3 text-center text-[#101828]">
                      <button
                        type="button"
                        onClick={() => onAction && onAction(original)}
                        className="inline-flex items-center justify-center rounded-md border border-[#d0d5dd] bg-white p-1.5 text-[#101828]"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {currentRows.map((row, idx) => (
          <div
            key={`${title}-card-${startIndex + idx}`}
            className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-4"
          >
            <div className="space-y-2">
              {row.map((cell, cellIdx) => (
                <div
                  key={`${title}-card-${startIndex + idx}-${cellIdx}`}
                  className="flex items-start justify-between gap-3 border-b border-[#edf0f2] pb-2 last:border-b-0 last:pb-0"
                >
                  <p className="text-xs font-semibold tracking-wide text-[#667085] uppercase">
                    {columns[cellIdx]}
                  </p>
                  <p className="max-w-[65%] text-right text-sm wrap-break-word text-[#344054]">
                    {cell}
                  </p>
                </div>
              ))}
              {withAction && (
                <div className="flex items-center justify-between border-t border-[#edf0f2] pt-2">
                  <p className="text-xs font-semibold tracking-wide text-[#667085] uppercase">
                    {actionLabel}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-[#d0d5dd] bg-white p-1.5 text-[#101828]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TablePagination
        currentPage={safePage}
        totalPages={totalPages}
        totalResults={totalResults}
        resultsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        wrapperClass="px-5 py-3"
        resultsTextClass="text-[12px] text-[#0F766E]"
        buttonClass="text-[12px]"
      />
    </div>
  );
};

const EventAnallyticsDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const activeTab = state?.tab || 'all';

  const eventsList = useSelector(selectAllEvents);
  const selectedEvent = useMemo(() => {
    if (state?.item) return state.item;
    const normalizedEvents = Array.isArray(eventsList) ? eventsList : [];
    return normalizedEvents.find((e) => String(e.id) === String(id)) || null;
  }, [state, eventsList, id]);

  const item = useMemo(() => {
    const baseItem = selectedEvent || fallbackEvent;
    return {
      ...baseItem,
      image:
        baseItem?.image ||
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=600&fit=crop',
      description: baseItem?.description || '-',
      eventType: baseItem?.eventType || baseItem?.type || '-',
      sportType: baseItem?.sportType || baseItem?.sport || '-',
      skillLevel: baseItem?.skillLevel || baseItem?.suitableFor || 'New to the sport',
      fullAddress: baseItem?.fullAddress || baseItem?.venue?.address || '-',
      venueName: baseItem?.venueName || baseItem?.venue?.name || '-',
      organizer:
        typeof baseItem?.organizer === 'string'
          ? {
              name: baseItem.organizer,
              avatar: 'https://ui-avatars.com/api/?name=Coach&background=0D8ABC&color=fff',
            }
          : baseItem?.organizer || {
              avatar: 'https://ui-avatars.com/api/?name=Coach&background=0D8ABC&color=fff',
            },
    };
  }, [selectedEvent]);
  const prefix = (location.pathname || '').split('/')[1] || 'coach';
  const backTarget = `/${prefix}/event-analytics?tab=${activeTab}`;
  const mapEmbedUrl = getMapEmbedUrl(item);

  const [message, setMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [interestsError, setInterestsError] = useState('');
  const [registerInterests, setRegisterInterests] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [eventMessages, setEventMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('idle');

  useEffect(() => {
    if (!id) {
      setEventRegistrations([]);
      return;
    }

    const abortController = new AbortController();

    const loadEventRegistrations = async () => {
      setBookingsLoading(true);
      setBookingsError('');

      try {
        const response = await GET(`/api/events/${id}/registrations`, {}, abortController.signal);
        const payload = response?.data;
        const registrationsData =
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.rows) && payload.rows) ||
          [];
        setEventRegistrations(registrationsData);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        setBookingsError(error?.response?.data?.message || 'Failed to load bookings');
        setEventRegistrations([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    loadEventRegistrations();

    return () => {
      abortController.abort();
    };
  }, [id]);

  useEffect(() => {
    if (!id) {
      setEventMessages([]);
      return;
    }

    const abortController = new AbortController();

    const loadEventMessages = async () => {
      setMessagesLoading(true);
      setMessagesError('');

      try {
        const response = await GET(`/api/events/${id}/messages`, {}, abortController.signal);
        console.log('Enquiries RAW Response from backend:', response);
        const payload = response?.data;
        const messagesData =
          (Array.isArray(payload?.data?.messages) && payload.data.messages) ||
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.rows) && payload.rows) ||
          [];
        setEventMessages(messagesData);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        console.error('Enquiries API Error:', error);
        setMessagesError(error?.response?.data?.message || 'Failed to load enquiries');
        setEventMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadEventMessages();

    return () => {
      abortController.abort();
    };
  }, [id]);

  useEffect(() => {
    console.log('Enquiries eventMessages state updated:', eventMessages);
  }, [eventMessages]);

  useEffect(() => {
    if (!id) {
      setRegisterInterests([]);
      return;
    }

    const abortController = new AbortController();

    const loadEventInterests = async () => {
      setInterestsLoading(true);
      setInterestsError('');

      try {
        const response = await GET(`/api/events/${id}/interests`, {}, abortController.signal);
        const payload = response?.data;
        const interestsData =
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.rows) && payload.rows) ||
          [];
        setRegisterInterests(interestsData);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        setInterestsError(error?.response?.data?.message || 'Failed to load register interests');
        setRegisterInterests([]);
      } finally {
        setInterestsLoading(false);
      }
    };

    loadEventInterests();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const bookingsRows = eventRegistrations.map((row) => [
    row.fullName || row.user?.name || '-',
    row.phoneNumber || row.user?.phoneNumber || '-',
    row.email || row.user?.email || '-',
  ]);

  const registerInterestRows = registerInterests.map((row) => [
    row.fullName || row.user?.name || '-',
    row.phoneNumber || row.user?.phoneNumber || '-',
    row.email || row.user?.email || '-',
  ]);

  const sortedEventMessages = [...eventMessages].sort((a, b) => {
    const first = new Date(a?.createdAt || 0).getTime();
    const second = new Date(b?.createdAt || 0).getTime();
    return second - first;
  });

  const enquiriesRows = sortedEventMessages.map((row) => [
    row.senderName || row.sender?.name || row.user?.name || row.fullName || '-',
    row.senderPhoneNumber ||
      row.sender?.phoneNumber ||
      row.sender?.phone ||
      row.phoneNumber ||
      row.user?.phoneNumber ||
      '-',
    row.senderEmail || row.sender?.email || row.user?.email || row.email || '-',
    row.message || row.content || '-',
    row.createdAt
      ? new Date(row.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
      : '-',
  ]);

  const handleOpenMessage = (messageObj) => {
    setSelectedMessage(messageObj || null);
    setReplyText('');
    setReplyStatus('idle');
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !id) return;
    const recipientId =
      selectedMessage.senderId ||
      selectedMessage.sender?.id ||
      selectedMessage.user?.id ||
      selectedMessage.userId ||
      selectedMessage.sender?.userId ||
      null;

    if (!replyText.trim()) {
      setReplyStatus('error');
      return;
    }

    if (!recipientId) {
      setReplyStatus('error');
      return;
    }

    setReplyStatus('loading');
    try {
      await POST(`/api/events/${id}/messages`, {
        recipientId,
        message: replyText.trim(),
      });
      setReplyStatus('success');
      setReplyText('');

      const res = await GET(`/api/events/${id}/messages`);
      const payload = res?.data;
      const messagesData =
        (Array.isArray(payload?.data?.messages) && payload.data.messages) ||
        (Array.isArray(payload?.data) && payload.data) ||
        (Array.isArray(payload) && payload) ||
        (Array.isArray(payload?.rows) && payload.rows) ||
        [];
      setEventMessages(messagesData);
      // close modal after brief delay
      setTimeout(() => setSelectedMessage(null), 800);
    } catch {
      setReplyStatus('error');
    }
  };

  const handleBookPlace = () => {
    setBookingSuccess(true);
    window.setTimeout(() => setBookingSuccess(false), 2400);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessageSuccess(true);
    setMessage('');
    window.setTimeout(() => setMessageSuccess(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-4 pt-5 pb-10 text-gray-800 md:px-6 lg:px-10">
      <div className="mb-2 flex items-center justify-between">
        <Link
          to={backTarget}
          className="inline-flex items-center text-[18px] font-normal text-[#0F766E]"
        >
          <ArrowLeft className="mr-1 h-5 w-5" /> Back
        </Link>
      </div>

      <div className="w-full rounded-xl">
        <img
          src={item.image}
          alt={item.title}
          className="h-65 w-full rounded-xl object-cover md:h-96 lg:h-100 xl:h-140 2xl:h-186"
        />
      </div>

      <div className="relative -mt-6 ml-3 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm md:-mt-8 md:ml-4 md:h-21 md:w-21">
        <img
          src={
            item.organizer?.avatar 
          }
          alt="Organizer"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-4">
        <h1 className="text-[28px] leading-tight font-semibold text-[#0C0C0C] md:text-[32px]">
          {item.title}
        </h1>
        <div className="mt-1 flex items-center gap-1 text-[16px] leading-6">
          <span className="font-medium text-[#373737]">Event Type:</span>
          <span>{item.eventType || 'Workshops & learning'}</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-5">
        <h2 className="text-[20px] leading-8 font-semibold text-black">Event Type</h2>
        <p className="mt-2 text-[14px] leading-5 whitespace-pre-line text-[#2D2D2D]">
          {item.description}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
        <SessionOverview event={item} onBookPlace={handleBookPlace} />
        <VenueInformation event={item} mapEmbedUrl={mapEmbedUrl} />
        <ContactOrganiser
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
        />
      </div>

      {(bookingSuccess || messageSuccess) && (
        <div className="border-loginInput mt-4 rounded-md border bg-white px-4 py-2 text-[14px] text-[#0F766E]">
          {bookingSuccess ? 'Successfully booked your place.' : 'Message sent to organiser.'}
        </div>
      )}

      <DataTable title="Bookings" columns={['Name', 'Phone Number', 'Email']} rows={bookingsRows} />
      {bookingsLoading && <div className="mt-2 text-sm text-gray-600">Loading bookings...</div>}
      {bookingsError && <div className="mt-2 text-sm text-red-600">{bookingsError}</div>}
      <DataTable
        title="Register Interest"
        columns={['Name', 'Phone Number', 'Email']}
        rows={registerInterestRows}
      />
      {interestsLoading && (
        <div className="mt-2 text-sm text-gray-600">Loading register interests...</div>
      )}
      {interestsError && <div className="mt-2 text-sm text-red-600">{interestsError}</div>}
      <DataTable
        title="Enquiries"
        columns={['Player Name', 'Phone Number', 'Email', 'Message', 'Date', 'ACTIONS']}
        rows={enquiriesRows}
        rawRows={sortedEventMessages}
        withAction
        onAction={handleOpenMessage}
      />
      {messagesLoading && <div className="mt-2 text-sm text-gray-600">Loading enquiries...</div>}
      {messagesError && <div className="mt-2 text-sm text-red-600">{messagesError}</div>}

      {/* Reply / Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-[#1A1D1F]">Applicant Details</p>
              </div>
              <button
                className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                onClick={() => setSelectedMessage(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#374151]">
              <p className="font-medium">
                {selectedMessage.senderName ||
                  selectedMessage.sender?.name ||
                  selectedMessage.user?.name ||
                  selectedMessage.fullName}
              </p>
              <p>
                {selectedMessage.senderPhoneNumber ||
                  selectedMessage.sender?.phone ||
                  selectedMessage.phoneNumber ||
                  selectedMessage.user?.phoneNumber}
              </p>
              <p>
                {selectedMessage.senderEmail ||
                  selectedMessage.sender?.email ||
                  selectedMessage.email ||
                  selectedMessage.user?.email}
              </p>
              <p className="pt-2 text-[13px] text-[#4B5563]">Event Name: {item.title}</p>

              <div className="pt-2 text-sm text-[#374151]">
                <p className="font-medium">Message</p>
                <p className="text-sm whitespace-pre-line text-[#4B5563]">
                  {selectedMessage.message || selectedMessage.content || '-'}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">
                  write your reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  className="rounded-lg border border-[#C7D7D4] px-4 py-2.5 text-sm font-medium text-[#1A1D1F] transition-colors hover:bg-[#EEF4F3]"
                  onClick={() => setSelectedMessage(null)}
                  disabled={replyStatus === 'loading'}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSendReply}
                  disabled={replyStatus === 'loading'}
                >
                  {replyStatus === 'loading' ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAnallyticsDetails;
