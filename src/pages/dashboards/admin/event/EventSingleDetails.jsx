import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import EventLoadingState from './components/singleEvent/EventLoadingState';
import EventErrorState from './components/singleEvent/EventErrorState';
import EventPendingBanner from './components/singleEvent/EventPendingBanner';
import EventHeroSection from './components/singleEvent/EventHeroSection';
import EventBannedAlert from './components/singleEvent/EventBannedAlert';
import EventOverviewSection from './components/singleEvent/EventOverviewSection';
import EventInteractionSection from './components/singleEvent/EventInteractionSection';
import EventVenueCard from './components/singleEvent/EventVenueCard';
import {
    DUMMY_IMAGE_PATH,
    pickImageSource,
    resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const formatReadableText = (value) => {
  if (!value) return 'N/A';
  return String(value)
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return 'Date not set';

  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formatSingleDate = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return formatter.format(parsed);
  };

  if (startDate && endDate && startDate !== endDate) {
    return `${formatSingleDate(startDate)} - ${formatSingleDate(endDate)}`;
  }

  return formatSingleDate(startDate || endDate);
};

const formatTimeRange = (startTime, endTime) => {
  if (!startTime && !endTime) return 'Time not set';

  const formatSingleTime = (value) => {
    if (!value) return null;

    const [hoursStr = '0', minutesStr = '0'] = String(value).split(':');
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return String(value);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const start = formatSingleTime(startTime);
  const end = formatSingleTime(endTime);

  if (start && end) return `${start} - ${end}`;
  return start || end || 'Time not set';
};

const buildMapEmbedUrl = (event) => {
  if (!event) return '';

  const querySource = [event.fullAddress, event.venueName, event.city]
    .filter(Boolean)
    .join(', ')
    .trim();

  if (!querySource) return '';

  return `https://www.google.com/maps?q=${encodeURIComponent(querySource)}&output=embed`;
};

const EventSingleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    const fetchEventDetails = async () => {
      if (!id) {
        if (isCurrentRequest) {
          setError('Event id is missing from the route.');
          setIsLoading(false);
          setHasLoaded(true);
        }
        return;
      }

      try {
        if (isCurrentRequest) {
          setIsLoading(true);
          setHasLoaded(false);
          setError('');
          setEventData(null);
        }

        const response = await GET(ENDPOINT.EVENTS.DETAIL(id), {}, controller.signal);
        const payload = response?.data?.data || response?.data || response;

        if (!payload || typeof payload !== 'object') {
          throw new Error('Event details were not returned by the server.');
        }

        if (isCurrentRequest) {
          setEventData(payload);
        }
      } catch (err) {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return;

        const message =
          err?.response?.data?.message || err?.message || 'Failed to load event details.';
        if (isCurrentRequest) {
          setError(message);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    };

    fetchEventDetails();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [id]);

  const normalizedStatus = useMemo(
    () => String(eventData?.status || '').toUpperCase(),
    [eventData?.status]
  );
  const isPending = normalizedStatus === 'PENDING' || normalizedStatus === 'PENDING_APPROVAL';
  const isBanned = normalizedStatus === 'BANNED' || normalizedStatus === 'REJECTED';
  const allowsQuestions =
    Array.isArray(eventData?.responseMethods) &&
    eventData.responseMethods.includes('Allow users to ask a question');
  const allowsBooking =
    Array.isArray(eventData?.responseMethods) &&
    eventData.responseMethods.includes('Add booking link');
  const allowsRegisterInterest =
    Array.isArray(eventData?.responseMethods) &&
    eventData.responseMethods.includes('Allow users to register interest');

  const dateValue = formatDateRange(eventData?.startDate, eventData?.endDate);
  const timeValue = formatTimeRange(eventData?.startTime, eventData?.endTime);
  const suitableForValue =
    Array.isArray(eventData?.suitableFor) && eventData.suitableFor.length > 0
      ? eventData.suitableFor.join(', ')
      : 'N/A';
  const ageGroupValue = eventData?.minAge ? `${eventData.minAge}+ Years` : 'N/A';
  const mapEmbedUrl = useMemo(() => buildMapEmbedUrl(eventData), [eventData]);
  const coverImage = useMemo(
    () =>
      resolveImageUrl(
        pickImageSource(eventData?.coverImage, eventData?.image),
        DUMMY_IMAGE_PATH
      ),
    [eventData]
  );
  const organizerAvatar = useMemo(
    () =>
      resolveImageUrl(
        pickImageSource(
          eventData?.organizer?.avatar,
          eventData?.organizerAvatar,
          eventData?.organizer?.image
        ),
        DUMMY_IMAGE_PATH
      ),
    [eventData]
  );

  if (isLoading || !hasLoaded) {
    return <EventLoadingState />;
  }

  if (error) {
    return <EventErrorState error={error} onBack={() => navigate(-1)} />;
  }

  if (!eventData) {
    return (
      <div className="relative flex-1 overflow-auto bg-[#F8F9FA] p-6 pb-12 font-sans md:p-8">
        <p className="text-base text-gray-600">No event details found.</p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-auto bg-[#F8F9FA] pb-12 font-sans">
     

      <div className="space-y-6 p-4 md:p-8">
        <EventHeroSection image={coverImage} onBack={() => navigate(-1)} />

        {isBanned && <EventBannedAlert reason={eventData.bannedReason || eventData.rejectionReason} />}

        <div className="grid grid-cols-1 gap-8 pt-2 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <EventOverviewSection
              title={eventData.title}
              views={eventData?.engagement?.views}
              trend={eventData?.engagement?.trend}
              messages={eventData?.engagement?.messages}
              participants={eventData.currentParticipants}
              sportType={eventData.sportType}
              eventType={formatReadableText(eventData.eventType)}
              description={eventData.description}
              dateValue={dateValue}
              timeValue={timeValue}
              suitableForValue={suitableForValue}
              ageGroupValue={ageGroupValue}
              skillLevel={formatReadableText(eventData.skillLevel)}
            />

            <EventInteractionSection
              allowsBooking={allowsBooking}
              allowsRegisterInterest={allowsRegisterInterest}
              allowsQuestions={allowsQuestions}
            />
          </div>

          <div className="lg:col-span-1 lg:mt-4">
            <EventVenueCard
              venueName={eventData.venueName}
              fullAddress={eventData.fullAddress}
              city={eventData.city}
              mapEmbedUrl={mapEmbedUrl}
              googleMapLink={eventData.googleMapLink}
              organizerPhone={eventData.organizerPhone}
              organizerEmail={eventData.organizerEmail}
              organizerName={eventData.organizerName || eventData?.organizer?.name}
              organizerAvatar={organizerAvatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSingleDetails;
