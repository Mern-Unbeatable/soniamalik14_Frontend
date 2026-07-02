import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, User } from 'lucide-react';
import Container from '../../../components/layout/Container';
import { useDispatch, useSelector } from 'react-redux';
import { ENV } from '../../../config/env';
import { fetchOrganizerEventById } from '../../../features/events/eventsAPI';
import SessionOverview from './components/SessionOverview';
import VenueInformation from './components/VenueInformation';
import ContactOrganiser from './components/ContactOrganiser';
import { useAuth } from '../../../context/AuthContext';
import { POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { toast } from 'react-toastify';
import LoginRequiredModal from './components/LoginRequiredModal';
const toTitleCase = (value = '') =>
  String(value)
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getWomenOnlyValue = (item) => {
  if (typeof item?.womensOnly === 'boolean') return item.womensOnly ? 'Yes' : 'No';
  if (typeof item?.womensOnly === 'string') return item.womensOnly;

  const description = String(item?.description || '').toLowerCase();
  const suitableFor = Array.isArray(item?.suitableFor)
    ? item.suitableFor.map((entry) => String(entry).toLowerCase())
    : [];

  const womenKeywords = ['women', 'woman', 'womens', 'women only', 'female', 'girls'];
  const isWomenOnly =
    womenKeywords.some((keyword) => description.includes(keyword)) ||
    suitableFor.some((entry) => womenKeywords.some((keyword) => entry.includes(keyword)));

  return isWomenOnly ? 'Yes' : 'No';
};

const getMapEmbedUrl = (item) => {
  if (!item) return '';

  const candidate = item.fullAddress || item.venueName || item.city || item.googleMapLink || '';
  if (!candidate) return '';

  return `https://www.google.com/maps?q=${encodeURIComponent(candidate)}&z=16&output=embed`;
};

const normalizeMediaUrl = (value) => {
  if (!value) return null;

  const mediaUrl = String(value).trim();
  if (!mediaUrl) return null;

  if (/^https?:\/\//i.test(mediaUrl)) {
    try {
      const parsedMediaUrl = new URL(mediaUrl);
      const apiBaseUrl = String(ENV.API_BASE_URL || '').trim();
      const parsedApiBaseUrl = apiBaseUrl ? new URL(apiBaseUrl) : null;

      if (
        parsedApiBaseUrl &&
        parsedMediaUrl.pathname.includes('/uploads/') &&
        parsedMediaUrl.hostname !== parsedApiBaseUrl.hostname
      ) {
        return `${parsedApiBaseUrl.origin}${parsedMediaUrl.pathname}${parsedMediaUrl.search}${parsedMediaUrl.hash}`;
      }

      return mediaUrl;
    } catch {
      return mediaUrl;
    }
  }

  const apiBaseUrl = String(ENV.API_BASE_URL || '').replace(/\/+$/, '');
  if (apiBaseUrl && mediaUrl.startsWith('/uploads/')) {
    return `${apiBaseUrl}${mediaUrl}`;
  }

  return mediaUrl;
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch();
  const apiItem = useSelector((state) => state.events.organizerEventDetails.item);
  const loading = useSelector((state) => state.events.organizerEventDetails.loading);
  const error = useSelector((state) => state.events.organizerEventDetails.error);

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchOrganizerEventById(id));
    setAvatarError(false);
  }, [id, dispatch]);

  const data = apiItem?.data || apiItem;

  useEffect(() => {
    if (data?.isSaved !== undefined) {
      setIsSaved(Boolean(data.isSaved));
    }
  }, [data?.id, data?.isSaved]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!id || saveLoading) return;

    try {
      setSaveLoading(true);
      const response = await POST(ENDPOINT.EVENTS.SAVE(id), {});
      const result = response?.data || response;
      const nextSavedState =
        result?.data?.isSaved !== undefined ? Boolean(result.data.isSaved) : !isSaved;

      setIsSaved(nextSavedState);
      toast.success(
        result?.message ||
          (nextSavedState ? 'Event saved successfully' : 'Event removed from saved')
      );
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || 'Failed to update saved event');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleModalLogin = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: `/events/${id}` } });
  };

  const handleBack = () => {
    const returnState = location.state;
    if (returnState?.from === 'my-events') {
      navigate('/dashboard/my-events', {
        state: {
          from: 'my-events',
          activeTab: returnState.activeTab || 'interested',
          currentPage: returnState.currentPage || 1,
        },
      });
      return;
    }
    navigate(-1);
  };

  const event = data
    ? {
        id: data.id,
        organizerId: data.organizerId || data.organizer?.id || '',
        title: data.title,
        titleColor: '#0B544E',
        coach: data.organizerName || data.organizer?.name || '',
        type: toTitleCase(data.eventType || ''),
        sport: data.sportType || '',
        suitableFor:
          Array.isArray(data.suitableFor) && data.suitableFor.length > 0
            ? data.suitableFor.join(', ')
            : 'All participants',
        womensOnly: getWomenOnlyValue(data),
        location: data.venueName || '',
        locationFull: data.fullAddress || '',
        postcode: data.postcode || '',
        town: data.city || '',
        day: data.startDate
          ? new Date(data.startDate).toLocaleDateString(undefined, { weekday: 'long' })
          : '',
        time:
          data.startTime && data.endTime
            ? `${data.startTime} - ${data.endTime}`
            : data.startTime || '',
        image: normalizeMediaUrl(data.image) || '/images/detaisPage/detailsBanner.png',
        organizerAvatar:
          normalizeMediaUrl(data.organizer?.avatar) || null,
        avatar: normalizeMediaUrl(data.organizer?.avatar) || null,
        mapEmbedUrl: getMapEmbedUrl(data),
        about: data.description || data.about || '',
        responseMethods: data.responseMethods || [],
      }
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-16">
        <Container>
          <div className="py-8 text-center">Loading event...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-16">
        <Container>
          <div className="py-8 text-center text-red-600">{error}</div>
        </Container>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-16">
        <Container>
          <div className="py-8 text-center">Event not found</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <Container>
        <div className="py-4 md:py-8">
          {/* Hero Banner Section */}
          <div className="relative mb-16">
            {/* Banner Image */}
            <div className="w-full overflow-hidden rounded-2xl shadow-sm md:h-96 lg:h-100 xl:h-140 2xl:h-186">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  onError={(imageEvent) => {
                    imageEvent.currentTarget.onerror = null;
                    imageEvent.currentTarget.src = '/images/detaisPage/detailsBanner.png';
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gray-300"></div>
              )}
            </div>

            {/* Overlaid Back Button */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-black/40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {/* Overlaid Favorite/Heart Button */}
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={saveLoading}
              aria-label={isSaved ? 'Remove from saved' : 'Save event'}
              className={`absolute top-4 right-4 rounded-full p-2.5 text-white backdrop-blur-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                isSaved ? 'bg-red-500/70 hover:bg-red-500/90' : 'bg-black/20 hover:bg-black/40'
              }`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>

            {/* Overlaid Avatar Picture */}
            <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-full border-4 border-[#F8FAFC] bg-gray-200 md:left-10 md:h-24 md:w-24 flex items-center justify-center">
              {event.organizerAvatar && !avatarError ? (
                <img
                  src={event.organizerAvatar}
                  alt={event.coach}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <User className="h-12 w-12 text-gray-500" />
              )}
            </div>
          </div>

          {/* Title & Info */}
          <div className="mb-8 px-2 md:px-4">
            <h1 className="text-2xl leading-tight font-bold text-[#0B544E] md:text-[32px]">
              {event.title}
            </h1>
            <p className="mt-2 text-base text-[#0C0C0C]">
              Event Type: <span className="text-[#0C0C0C]">{event.type}</span>
            </p>
          </div>

          {/* Session Details Card */}
          <div className="mb-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-[#000000]">Event Type</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap text-[#272727] md:max-w-7xl">
              {event.about}
            </div>
          </div>

          {/* 3-Column Grid for Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {/* Column 1: Session Overview */}
            <SessionOverview event={event} />

            {/* Column 2: Venue Information */}
            <VenueInformation event={event} />

            {/* Column 3: Contact Organiser */}
            <ContactOrganiser event={event} />
          </div>
        </div>
      </Container>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleModalLogin}
      />
    </div>
  );
};

export default EventDetails;
