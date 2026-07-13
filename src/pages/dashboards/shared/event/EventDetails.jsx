import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { fetchOrganizerEventById } from '../../../../features/events/eventsAPI';
import {
  selectOrganizerEventDetails,
  selectOrganizerEventDetailsError,
  selectOrganizerEventDetailsLoading,
} from '../../../../features/events/eventsSlice';
import SessionOverview from './components/SessionOverview';
import VenueInformation from './components/VenueInformation';
import ContactOrganiser from './components/ContactOrganiser';

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
      // If URL parsing fails, treat the value as a plain location query.
    }

    return buildEmbed(directMapLink);
  }

  const fallbackQuery = event?.fullAddress || event?.venue?.address || event?.venueName || '';
  if (!fallbackQuery) return '';
  return buildEmbed(fallbackQuery);
};

const toNormalText = (str) => {
  if (!str) return '';
  const cleaned = String(str).toLowerCase().replace(/_/g, ' ');
  return cleaned.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const EventDetails = ({ backRoute = '/provider/event', useOrganizerApi }) => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const eventDetails = useSelector(selectOrganizerEventDetails);
  const eventLoading = useSelector(selectOrganizerEventDetailsLoading);
  const eventError = useSelector(selectOrganizerEventDetailsError);

  const [message, setMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [copiedEventLink, setCopiedEventLink] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchOrganizerEventById(id));
  }, [dispatch, id]);

  const event = eventDetails?.data || eventDetails || null;

  const handleCopyEventLink = () => {
    if (event?.id) {
      const publicLink = `${window.location.origin}/events/${event.id}`;
      navigator.clipboard.writeText(publicLink);
      setCopiedEventLink(true);
      setTimeout(() => setCopiedEventLink(false), 2000);
    }
  };

  const handleBack = () => {
    navigate(backRoute, {
      state: {
        filter: state?.filter || { status: 'All', query: '' },
        currentPage: state?.currentPage || 1,
      },
    });
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

  if (eventLoading && !event) {
    return <div className="py-20 text-center text-gray-600">Loading event...</div>;
  }

  if (eventError && !event) {
    return <div className="py-20 text-center text-red-600">Error: {eventError}</div>;
  }

  if (!event) {
    return <div className="py-20 text-center text-gray-600">Event not found</div>;
  }

  const mapEmbedUrl = getMapEmbedUrl(event);

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-4 pt-5 pb-10 md:px-6 lg:px-10">
      <div className="mx-auto w-full">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-[18px] font-normal text-[#0F766E]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          {event?.status === 'PENDING_APPROVAL' || event?.status === 'PENDING' ? (
            <span className="text-sm font-medium text-gray-500 italic">
              You can share your link after admin approved
            </span>
          ) : (
            <button
              onClick={handleCopyEventLink}
              className="inline-flex items-center gap-2 rounded-lg border border-[#0F766E] bg-white px-4 py-2 text-sm font-medium text-[#0F766E] shadow-sm transition hover:bg-[#E7F1F1]"
            >
              {copiedEventLink ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-600">Event Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Event Link</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl">
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
          <h1 className="text-[28px] leading-tight font-semibold text-[#0C0C0C] md:text-[32px]">
            {event.title}
          </h1>
          <div className="mt-1 flex items-center gap-1 text-[16px] leading-6">
            <span className="font-medium text-[#373737]">Event Type:</span>
            <span className="text-[#0C0C0C]">{toNormalText(event.eventType)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-white p-5">
          <h2 className="text-[20px] leading-8 font-semibold text-black">Event Type</h2>
          <p className="mt-2 text-[14px] leading-5 whitespace-pre-line text-[#2d2d2d]">
            {event.description}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
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
      </div>
    </div>
  );
};

export default EventDetails;
