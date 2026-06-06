import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TablePagination from '../../../../components/ui/TablePagination';
import insightsData from '../../../../data/providerInsightsData.json';
import { GET } from '../../../../services/httpMethods';
import SessionOverview from '../event/components/SessionOverview';
import VenueInformation from '../event/components/VenueInformation';
import ContactOrganiser from '../event/components/ContactOrganiser';

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

  const fallbackQuery = event?.fullAddress || event?.venue?.address || event?.venueName || event?.venue || '';
  if (!fallbackQuery) return '';
  return buildEmbed(fallbackQuery);
};

const EnquiryDetailsModal = ({ isOpen, onClose, enquiry, eventTitle }) => {
  if (!isOpen || !enquiry) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8EA] px-5 py-4">
          <h3 className="text-xl font-semibold text-[#1D1D1D]">Enquiry Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#1D1D1D]"
            aria-label="Close enquiry details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
            <p className="text-sm font-semibold tracking-wide text-[#0F766E] uppercase">Event</p>
            <p className="mt-1 text-base font-semibold text-[#1D1D1D]">{eventTitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
              <p className="text-sm font-semibold tracking-wide text-[#6B7280] uppercase">
                Player Name
              </p>
              <p className="mt-1 text-base font-medium text-[#1D1D1D]">{enquiry.playerName}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
              <p className="text-sm font-semibold tracking-wide text-[#6B7280] uppercase">
                Phone Number
              </p>
              <p className="mt-1 text-base font-medium text-[#1D1D1D]">{enquiry.phone}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4 sm:col-span-2">
              <p className="text-sm font-semibold tracking-wide text-[#6B7280] uppercase">Email</p>
              <p className="mt-1 text-base font-medium break-all text-[#1D1D1D]">{enquiry.email}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4 sm:col-span-2">
              <p className="text-sm font-semibold tracking-wide text-[#6B7280] uppercase">
                Message
              </p>
              <p className="mt-1 text-base leading-relaxed text-[#374151]">{enquiry.message}</p>
            </div>
            <div className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4 sm:col-span-2">
              <p className="text-sm font-semibold tracking-wide text-[#6B7280] uppercase">Date</p>
              <p className="mt-1 text-base font-medium text-[#1D1D1D]">{enquiry.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusMeta = {
  complete: {
    label: 'Complete',
    className: 'bg-[#E8F8EF] text-[#15803D] border border-[#BBE6CC]',
  },
  upcoming: {
    label: 'Upcoming',
    className: 'bg-[#EAF3FF] text-[#1D4ED8] border border-[#BED8FF]',
  },
  pending: {
    label: 'Pending',
    className: 'bg-[#FFF6E8] text-[#B45309] border border-[#FFD9A6]',
  },
  cancel: {
    label: 'Cancelled',
    className: 'bg-[#FEECEC] text-[#B91C1C] border border-[#FECACA]',
  },
};

const InsightsPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const rawEvent = state?.item || insightsData.find((item) => item.id === id) || insightsData[0];
  const event = useMemo(
    () => ({
      ...rawEvent,
      image: rawEvent?.image || rawEvent?.coverImage || '/images/Football.jpg',
      description: rawEvent?.description || rawEvent?.about || '-',
      eventType: rawEvent?.eventType || rawEvent?.type || '-',
      sportType: rawEvent?.sportType || rawEvent?.sport || '-',
      venueName: rawEvent?.venueName || '-',
      fullAddress: rawEvent?.fullAddress || rawEvent?.venue || '-',
      organizer: rawEvent?.organizer || {
        name: rawEvent?.organizer || 'Organizer',
        avatar: 'https://ui-avatars.com/api/?name=Provider&background=0F766E&color=fff',
      },
    }),
    [rawEvent]
  );
  const statusConfig = statusMeta[event.status];
  const mapEmbedUrl = getMapEmbedUrl(event);

  const [bookingPage, setBookingPage] = useState(1);
  const [interestPage, setInterestPage] = useState(1);
  const [enquiryPage, setEnquiryPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
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
  const perPage = 6;

  useEffect(() => {
    const eventId = event?.id;
    if (!eventId) {
      setEventRegistrations([]);
      return;
    }

    const abortController = new AbortController();

    const loadBookings = async () => {
      setBookingsLoading(true);
      setBookingsError('');

      try {
        const response = await GET(`/api/events/${eventId}/registrations`, {}, abortController.signal);
        const payload = response?.data;
        const data =
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.rows) && payload.rows) ||
          [];
        setEventRegistrations(data);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        setBookingsError(error?.response?.data?.message || 'Failed to load bookings');
        setEventRegistrations([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    loadBookings();

    return () => abortController.abort();
  }, [event?.id]);

  useEffect(() => {
    const eventId = event?.id;
    if (!eventId) {
      setRegisterInterests([]);
      return;
    }

    const abortController = new AbortController();

    const loadInterests = async () => {
      setInterestsLoading(true);
      setInterestsError('');

      try {
        const response = await GET(`/api/events/${eventId}/interests`, {}, abortController.signal);
        const payload = response?.data;
        const data =
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.rows) && payload.rows) ||
          [];
        setRegisterInterests(data);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        setInterestsError(error?.response?.data?.message || 'Failed to load register interests');
        setRegisterInterests([]);
      } finally {
        setInterestsLoading(false);
      }
    };

    loadInterests();

    return () => abortController.abort();
  }, [event?.id]);

  useEffect(() => {
    const eventId = event?.id;
    if (!eventId) {
      setEventMessages([]);
      return;
    }

    const abortController = new AbortController();

    const loadMessages = async () => {
      setMessagesLoading(true);
      setMessagesError('');

      try {
        const response = await GET(`/api/events/${eventId}/messages`, {}, abortController.signal);
        const payload = response?.data;
        const data =
          (Array.isArray(payload?.data) && payload.data) ||
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.rows) && payload.rows) ||
          [];
        setEventMessages(data);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        setMessagesError(error?.response?.data?.message || 'Failed to load enquiries');
        setEventMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();

    return () => abortController.abort();
  }, [event?.id]);

  const bookings = useMemo(
    () =>
      eventRegistrations.map((item) => ({
        id: item.id,
        name: item.fullName || item.user?.name || '-',
        phone: item.phoneNumber || item.user?.phoneNumber || '-',
        email: item.email || item.user?.email || '-',
      })),
    [eventRegistrations]
  );

  const interests = useMemo(
    () =>
      registerInterests.map((item) => ({
        id: item.id,
        name: item.fullName || item.user?.name || '-',
        phone: item.phoneNumber || item.user?.phoneNumber || '-',
        email: item.email || item.user?.email || '-',
      })),
    [registerInterests]
  );

  const enquiries = useMemo(() => {
    const sortedMessages = [...eventMessages].sort((a, b) => {
      const first = new Date(a?.createdAt || 0).getTime();
      const second = new Date(b?.createdAt || 0).getTime();
      return second - first;
    });

    return sortedMessages.map((item) => ({
      id: item.id,
      playerName: item.senderName || item.sender?.name || item.user?.name || item.fullName || '-',
      phone:
        item.senderPhoneNumber ||
        item.sender?.phoneNumber ||
        item.sender?.phone ||
        item.phoneNumber ||
        item.user?.phoneNumber ||
        '-',
      email: item.senderEmail || item.sender?.email || item.user?.email || item.email || '-',
      message: item.message || item.content || '-',
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })
        : '-',
    }));
  }, [eventMessages]);

  const bookingTotalPages = Math.max(1, Math.ceil(bookings.length / perPage));
  const interestTotalPages = Math.max(1, Math.ceil(interests.length / perPage));
  const enquiryTotalPages = Math.max(1, Math.ceil(enquiries.length / perPage));
  const safeBookingPage = Math.min(bookingPage, bookingTotalPages);
  const safeInterestPage = Math.min(interestPage, interestTotalPages);
  const safeEnquiryPage = Math.min(enquiryPage, enquiryTotalPages);

  const paginatedBookings = useMemo(() => {
    const start = (safeBookingPage - 1) * perPage;
    return bookings.slice(start, start + perPage);
  }, [bookings, safeBookingPage]);

  const paginatedInterests = useMemo(() => {
    const start = (safeInterestPage - 1) * perPage;
    return interests.slice(start, start + perPage);
  }, [interests, safeInterestPage]);

  const paginatedEnquiries = useMemo(() => {
    const start = (safeEnquiryPage - 1) * perPage;
    return enquiries.slice(start, start + perPage);
  }, [enquiries, safeEnquiryPage]);

  const openEnquiryModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
    setSelectedEnquiry(null);
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
    <div className="min-h-screen bg-[#f4f6f8] px-4 pb-10 pt-5 md:px-6 lg:px-10">
      <div className="mx-auto w-full">
        <button
          type="button"
          onClick={() =>
            navigate('/provider/insights', {
              state: {
                activeTab: state?.activeTab || 'all',
                currentPage: state?.currentPage || 1,
              },
            })
          }
          className="mb-4 inline-flex items-center gap-2 text-[18px] font-normal text-[#0F766E]"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        <div className="w-full rounded-xl">
          <img
            src={event.image}
            alt={event.title}
            className="h-65 w-full rounded-xl object-cover md:h-96 lg:h-100 xl:h-140 2xl:h-186"
          />
        </div>

        <div className="relative -mt-6 ml-3 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm md:-mt-8 md:ml-4 md:h-21 md:w-21">
          <img
            src={
              event.organizer?.avatar ||
              'https://ui-avatars.com/api/?name=Provider&background=0F766E&color=fff'
            }
            alt={event.organizer?.name || 'Organizer'}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-semibold leading-tight text-[#0C0C0C] md:text-[32px]">
              {event.title}
            </h1>
            {statusConfig && (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-base font-semibold ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[16px] leading-6">
            <span className="font-medium text-[#373737]">Event Type:</span>
            <span className="text-[#0C0C0C]">{event.eventType}</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-white p-5">
          <h2 className="text-[20px] font-semibold leading-8 text-black">Event Type</h2>
          <p className="mt-2 whitespace-pre-line text-[14px] leading-5 text-[#2d2d2d]">
            {event.description}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3 lg:gap-6">
          <SessionOverview event={event} onBookPlace={handleBookPlace} />
          <VenueInformation event={event} mapEmbedUrl={mapEmbedUrl} />
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

        <section className="mt-4 rounded-lg bg-white shadow-sm">
          <div className="border-b border-[#E2E8EA] px-4 py-3">
            <h3 className="text-2xl font-semibold text-[#1D1D1D]">Bookings</h3>
          </div>

          {bookingsLoading && (
            <div className="px-4 pt-4 text-sm text-gray-600">Loading bookings...</div>
          )}

          {bookingsError && (
            <div className="px-4 pt-4 text-sm text-red-600">{bookingsError}</div>
          )}

          {!bookingsLoading && !bookingsError && bookings.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">No bookings data found.</div>
          )}

          {!bookingsLoading && !bookingsError && bookings.length > 0 && <div className="space-y-3 p-4 md:hidden">
            {paginatedBookings.map((booking, idx) => (
              <div
                key={`${booking.email}-${idx}`}
                className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-3"
              >
                <p className="text-base font-semibold text-[#1D1D1D]">{booking.name}</p>
                <p className="mt-1 text-sm text-[#4B5563]">Phone: {booking.phone}</p>
                <p className="mt-1 text-sm break-all text-[#4B5563]">Email: {booking.email}</p>
              </div>
            ))}
          </div>}

          {!bookingsLoading && !bookingsError && bookings.length > 0 && <div className="hidden overflow-x-auto md:block">
            <table className="min-w-160 border-collapse lg:min-w-full">
              <thead>
                <tr className="bg-[#F8FAFA] text-left">
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Name</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Email</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking, idx) => (
                  <tr key={`${booking.email}-${idx}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{booking.name}</td>
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{booking.phone}</td>
                    <td className="px-4 py-3 text-sm break-all text-[#2F3B3A]">{booking.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
          {!bookingsLoading && !bookingsError && bookings.length > 0 && <TablePagination
            currentPage={safeBookingPage}
            totalPages={bookingTotalPages}
            totalResults={bookings.length}
            resultsPerPage={perPage}
            onPageChange={(p) => setBookingPage(Math.max(1, Math.min(bookingTotalPages, p)))}
            wrapperClass="px-4 py-3"
            resultsTextClass="text-sm text-[#0F766E]"
            buttonClass="px-3 py-1 text-sm rounded-md"
          />}
        </section>

        <section className="mt-4 rounded-lg bg-white shadow-sm">
          <div className="border-b border-[#E2E8EA] px-4 py-3">
            <h3 className="text-2xl font-semibold text-[#1D1D1D]">Register Interest</h3>
          </div>

          {interestsLoading && (
            <div className="px-4 pt-4 text-sm text-gray-600">Loading register interests...</div>
          )}

          {interestsError && (
            <div className="px-4 pt-4 text-sm text-red-600">{interestsError}</div>
          )}

          {!interestsLoading && !interestsError && interests.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">No register interest data found.</div>
          )}

          {!interestsLoading && !interestsError && interests.length > 0 && <div className="space-y-3 p-4 md:hidden">
            {paginatedInterests.map((interest, idx) => (
              <div
                key={`${interest.email}-${idx}`}
                className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-3"
              >
                <p className="text-base font-semibold text-[#1D1D1D]">{interest.name}</p>
                <p className="mt-1 text-sm text-[#4B5563]">Phone: {interest.phone}</p>
                <p className="mt-1 text-sm break-all text-[#4B5563]">Email: {interest.email}</p>
              </div>
            ))}
          </div>}

          {!interestsLoading && !interestsError && interests.length > 0 && <div className="hidden overflow-x-auto md:block">
            <table className="min-w-160 border-collapse lg:min-w-full">
              <thead>
                <tr className="bg-[#F8FAFA] text-left">
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Name</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Email</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInterests.map((interest, idx) => (
                  <tr key={`${interest.email}-${idx}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{interest.name}</td>
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{interest.phone}</td>
                    <td className="px-4 py-3 text-sm break-all text-[#2F3B3A]">{interest.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
          {!interestsLoading && !interestsError && interests.length > 0 && <TablePagination
            currentPage={safeInterestPage}
            totalPages={interestTotalPages}
            totalResults={interests.length}
            resultsPerPage={perPage}
            onPageChange={(p) => setInterestPage(Math.max(1, Math.min(interestTotalPages, p)))}
            wrapperClass="px-4 py-3"
            resultsTextClass="text-sm text-[#0F766E]"
            buttonClass="px-3 py-1 text-sm rounded-md"
          />}
        </section>

        <section className="mt-4 rounded-lg bg-white shadow-sm">
          <div className="border-b border-[#E2E8EA] px-4 py-3">
            <h3 className="text-2xl font-semibold text-[#1D1D1D]">Enquiries</h3>
          </div>

          {messagesLoading && (
            <div className="px-4 pt-4 text-sm text-gray-600">Loading enquiries...</div>
          )}

          {messagesError && (
            <div className="px-4 pt-4 text-sm text-red-600">{messagesError}</div>
          )}

          {!messagesLoading && !messagesError && enquiries.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-500">No enquiries data found.</div>
          )}

          {!messagesLoading && !messagesError && enquiries.length > 0 && <div className="space-y-3 p-4 md:hidden">
            {paginatedEnquiries.map((enquiry, idx) => (
              <div
                key={`${enquiry.email}-${idx}`}
                className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-3"
              >
                <p className="text-base font-semibold text-[#1D1D1D]">{enquiry.playerName}</p>
                <p className="mt-1 text-sm text-[#4B5563]">Phone: {enquiry.phone}</p>
                <p className="mt-1 text-sm break-all text-[#4B5563]">Email: {enquiry.email}</p>
                <p className="mt-1 text-sm text-[#4B5563]">Date: {enquiry.date}</p>
                <p className="mt-1 text-sm text-[#4B5563]">Message: {enquiry.message}</p>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => openEnquiryModal(enquiry)}
                    className="inline-flex items-center justify-center rounded-md p-1 text-[#1D1D1D] hover:bg-[#EAF2F1]"
                    aria-label={`Open enquiry details for ${enquiry.playerName}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>}

          {!messagesLoading && !messagesError && enquiries.length > 0 && <div className="hidden overflow-x-auto md:block">
            <table className="min-w-230 border-collapse xl:min-w-full">
              <thead>
                <tr className="bg-[#F8FAFA] text-left">
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Player Name</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Email</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Message</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Date</th>
                  <th className="px-4 py-3 text-center text-base font-medium text-[#1D1D1D]">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEnquiries.map((enquiry, idx) => (
                  <tr key={`${enquiry.email}-${idx}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{enquiry.playerName}</td>
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{enquiry.phone}</td>
                    <td className="px-4 py-3 text-sm break-all text-[#2F3B3A]">{enquiry.email}</td>
                    <td className="max-w-65 px-4 py-3 text-sm text-[#2F3B3A]">{enquiry.message}</td>
                    <td className="px-4 py-3 text-sm text-[#2F3B3A]">{enquiry.date}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => openEnquiryModal(enquiry)}
                        className="inline-flex items-center justify-center rounded-md p-1 text-[#1D1D1D] hover:bg-[#EAF2F1]"
                        aria-label={`Open enquiry details for ${enquiry.playerName}`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
          {!messagesLoading && !messagesError && enquiries.length > 0 && <TablePagination
            currentPage={safeEnquiryPage}
            totalPages={enquiryTotalPages}
            totalResults={enquiries.length}
            resultsPerPage={perPage}
            onPageChange={(p) => setEnquiryPage(Math.max(1, Math.min(enquiryTotalPages, p)))}
            wrapperClass="px-4 py-3"
            resultsTextClass="text-sm text-[#0F766E]"
            buttonClass="px-3 py-1 text-sm rounded-md"
          />}
        </section>

        <EnquiryDetailsModal
          isOpen={isEnquiryModalOpen}
          onClose={closeEnquiryModal}
          enquiry={selectedEnquiry}
          eventTitle={event.title}
        />
      </div>
    </div>
  );
};

export default InsightsPreview;
