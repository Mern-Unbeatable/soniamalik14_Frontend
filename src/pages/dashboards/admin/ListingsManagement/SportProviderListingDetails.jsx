import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Award,
    CalendarDays,
    Users,
    Code,
    AlertCircle,
    Eye,
    MessageSquare,
    TrendingUp,
    ExternalLink,
    ArrowLeft // Added import
} from 'lucide-react';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import {
    DUMMY_IMAGE_PATH,
    handleImageLoadError,
    pickImageSource,
    resolveImageUrl,
} from '../../../../utils/resolveImageUrl';
import BlankCalendarIcon from '../../../../components/ui/BlankCalendarIcon';
import {
    formatScheduleDaysLabel,
    formatScheduleTimeLine,
    parseSchedulesFromService,
} from '../../../../utils/sessionSchedules';

const DISCOVER_PLACEHOLDER = '/discover-placeholder.png';

const normalizeStatus = (service) => {
    if (service?.bannedAt || service?.bannedReason) return 'Banned';
    if (service?.isFeatured) return 'Featured';

    const normalized = String(service?.status || '').trim().toLowerCase();
    if (['active', 'approved', 'live'].includes(normalized)) return 'Live';
    if (['pending', 'pending_approval'].includes(normalized)) return 'Pending';
    if (['banned', 'blocked', 'rejected'].includes(normalized)) return 'Banned';

    return 'Pending';
};

const formatReadableDate = (value) => {
    if (!value) return '';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const buildGoogleMapsSearchUrl = (query) => {
    const normalized = String(query || '').trim();
    if (!normalized || normalized.toLowerCase() === 'not specified') return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const getMapEmbedUrl = (service) => {
    const rawLink = String(service?.googleMapLink || service?.googleMapLinks || '').trim();
    if (rawLink) {
        try {
            const url = new URL(rawLink);

            if (url.pathname.includes('/maps/embed')) {
                return url.toString();
            }

            const q = url.searchParams.get('q');
            if (q) {
                return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
            }

            return `https://www.google.com/maps?q=${encodeURIComponent(rawLink)}&output=embed`;
        } catch {
            return `https://www.google.com/maps?q=${encodeURIComponent(rawLink)}&output=embed`;
        }
    }

    const locationQuery = [
        service?.fullAddress,
        service?.clinicName,
        service?.location,
        service?.city,
        service?.postcode,
    ]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .join(', ');

    if (!locationQuery) return '';
    return `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=15&output=embed`;
};

const SportProviderListingDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [service, setService] = useState(null);

    useEffect(() => {
        let active = true;

        const loadService = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await GET(ENDPOINT.SERVICES.DETAIL(id));
                const payload = response?.data || response;
                const nextService = payload?.data?.service || payload?.service || payload?.data || null;

                if (!active) return;
                if (!nextService?.id) {
                    setService(null);
                    setError('Service not found.');
                    return;
                }

                setService(nextService);
            } catch (err) {
                if (!active) return;
                setError(err?.response?.data?.message || err?.message || 'Failed to load service details');
                setService(null);
            } finally {
                if (active) setLoading(false);
            }
        };

        if (!id) {
            setError('Invalid service id.');
            setLoading(false);
            return;
        }

        loadService();

        return () => {
            active = false;
        };
    }, [id]);

    const data = useMemo(() => {
        if (!service) return null;

        const sports = Array.isArray(service?.sports) ? service.sports : [];
        const sessionTypes = Array.isArray(service?.sessionTypes) ? service.sessionTypes : [];
        const suitableFor = Array.isArray(service?.suitableFor) ? service.suitableFor : [];
        const days = Array.isArray(service?.availableDays) ? service.availableDays : [];
        const schedules = parseSchedulesFromService(service || {});
        const scheduleDays = formatScheduleDaysLabel(schedules);
        const scheduleTimes = formatScheduleTimeLine(schedules);

        return {
            id: service?.id,
            listing:
                service?.listingHeadline ||
                service?.organizationName ||
                service?.providerName ||
                service?.clinicName ||
                'Untitled Listing',
            coach:
                service?.organizationName ||
                service?.provider?.organizationName ||
                '',
            status: normalizeStatus(service),
            engagement: null,
            coverImage: resolveImageUrl(
                pickImageSource(service?.image),
                DISCOVER_PLACEHOLDER
            ),
            avatar: resolveImageUrl(
                pickImageSource(service?.logo, service?.provider?.avatar),
                DUMMY_IMAGE_PATH
            ),
            about: service?.aboutService || service?.description || 'No description available.',
            costMemebershipDetail:
                service?.costMemebershipDetail || service?.costMembershipDetail || '',
            sport: sports.length > 0 ? sports.join(', ') : 'Not specified',
            sessionType:
                sessionTypes.length > 0
                    ? sessionTypes.join(', ')
                    : service?.isOnline
                        ? 'Online'
                        : 'In-person',
            suitableFor:
                suitableFor.length > 0
                    ? suitableFor.join(', ')
                    : service?.womenOnly
                        ? "Women's only"
                        : 'All participants',
            womenOnly: typeof service?.womenOnly === 'boolean' ? (service.womenOnly ? 'Yes' : 'No') : 'Not specified',
            venueName: service?.clinicName || '',
            addressLine1: service?.addressLine1 || '',
            postcode: service?.postcode || '',
            townCity: service?.city || '',
            sessionDays:
                scheduleDays ||
                service?.sessonDay ||
                (days.length > 0 ? days.join(', ') : '') ||
                (service?.date ? `Date: ${formatReadableDate(service.date)}` : ''),
            sessionTime: scheduleTimes || service?.timeSlote || '',
            frequency: String(service?.frequency || service?.sessionFrequency || '').trim(),
            participantResponseType: service?.participantResponseType || 'ADD_BOOKING_LINK',
            fullAddress: service?.fullAddress || '',
            googleMapLink: service?.googleMapLink || service?.googleMapLinks || '',
            mapEmbedUrl: getMapEmbedUrl(service),
            postcodeMapsUrl: buildGoogleMapsSearchUrl(service?.postcode),
            townCityMapsUrl: buildGoogleMapsSearchUrl(service?.city || service?.location),
        };
    }, [service]);

    if (loading) {
        return (
            <div className="flex-1 overflow-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <LoadingSpinner label="" containerClassName="py-0" />
            </div>
        );
    }

    if (error) {
        return <div className="flex-1 overflow-auto bg-gray-50 p-8 text-center text-red-600">Error: {error}</div>;
    }

    if (!data) {
        return (
            <div className="flex-1 overflow-auto bg-gray-50 p-8 flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-btn-primary text-white rounded-lg">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto bg-gray-50 min-h-screen relative ">

     

            <div className=" p-4 md:p-8 space-y-8">

                {/* Hero Section */}
                <div className="relative">
                    {/* Cover Image */}
                    <img
                        src={data.coverImage}
                        alt={data.listing}
                        className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-sm"
                        onError={(e) => handleImageLoadError(e, DISCOVER_PLACEHOLDER)}
                    />

                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white rounded-lg text-btn-primary font-medium transition-colors shadow-md z-10"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className='text-sm'>Back</span>
                    </button>

                    {/* Profile Picture overlapping */}
                    <div className="absolute -bottom-10 left-8">
                        <img
                            src={data.avatar}
                            alt="Organisation"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                            onError={(e) => handleImageLoadError(e, DUMMY_IMAGE_PATH)}
                        />
                    </div>
                </div>

                {/* Header Info */}
                <div className="pt-10 px-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">{data.listing}</h1>
                    {data.coach ? (
                        <p className="mb-3 text-lg font-semibold text-gray-900">{data.coach}</p>
                    ) : null}

                    {/* Mini Stats (From Image 1) */}
                    {data.engagement && (
                        <div className="flex items-center gap-4 text-base font-medium text-gray-500">
                            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {data.engagement.views}</span>
                            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {data.engagement.trend}</span>
                            <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {data.engagement.messages}</span>
                            <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> {data.engagement.shares}</span>
                        </div>
                    )}
                </div>

                {/* 2. Banned Status Alert Banner */}
                {data.status === 'Banned' && (
                    <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 mx-2 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-xl font-semibold text-red-600 mb-1">This event was not approved</h3>
                            <p className="text-base leading-relaxed text-red-500">
                                Your event could not be published because it does not meet our community or safety guidelines.<br />
                                Please review the feedback below, make the required changes, and submit again.
                            </p>
                        </div>
                    </div>
                )}

                {/* Session Details Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mx-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">About this session</h2>
                    <p className="text-base text-[#000000] leading-relaxed mb-4 xl:max-w-6xl">
                        {data.about}
                    </p>
                    {data.costMemebershipDetail ? (
                        <>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">
                                Cost or membership details
                            </h3>
                            <p className="text-base text-[#000000] leading-relaxed whitespace-pre-wrap xl:max-w-6xl">
                                {data.costMemebershipDetail}
                            </p>
                        </>
                    ) : null}
                    {/* <p className="text-base text-[#000000]">Join and improve with confidence.</p> */}
                </div>

                {/* Bottom Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-2">

                    {/* Left Column */}
                    <div className="space-y-6">

                        {/* Session Overview */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Overview</h2>
                            <div className="space-y-3">
                                {/* Overview Card 1 */}
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="p-2 bg-[#E7F1F1] rounded-full text-[#00786F]"><Award className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">Sport</p>
                                        <p className="text-base text-gray-500">{data.sport}</p>
                                    </div>
                                </div>
                                {/* Overview Card 2 */}
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="p-2 bg-[#E7F1F1] rounded-full text-[#00786F]"><CalendarDays className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">Session Type</p>
                                        <p className="text-base text-gray-500">{data.sessionType}</p>   
                                    </div>
                                </div>
                                {/* Overview Card 3 */}
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="p-2 bg-[#E7F1F1] rounded-full text-[#00786F]"><Users className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">Suitable for</p>
                                        <p className="text-base text-gray-500">{data.suitableFor}</p>
                                    </div>
                                </div>
                                {/* Overview Card 4 — match public Discover Participation label */}
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="p-2 bg-[#E7F1F1] rounded-full text-[#00786F]"><Users className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">Participation</p>
                                        <p className="text-base text-gray-500">
                                            {data.womenOnly === 'Yes'
                                                ? 'Women-only'
                                                : data.womenOnly === 'No'
                                                    ? 'Mixed, women welcome'
                                                    : data.womenOnly}
                                        </p>
                                    </div>
                                </div>
                            </div>

                             {/* Action Buttons */}
                             <div className="flex flex-col md:flex-row gap-3 mt-4">
                                 {data.participantResponseType !== 'ALLOW_REGISTER_INTEREST' ? (
                                     <button className="px-5 py-2.5 bg-btn-primary text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                                         Register
                                     </button>
                                 ) : (
                                     <button className="px-5 py-2.5 bg-btn-primary text-white text-sm font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                                         Register Interest
                                     </button>
                                 )}
                             </div>
                        </div>

                        {/* Contact Organiser */}
                        {/* <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Organiser</h2>
                            <div className="bg-[#E7F1F1] p-4 rounded-xl border border-gray-100">
                                <p className="text-base text-gray-900 mb-3 font-medium">Ask the organiser a question</p>
                                <textarea
                                    className="w-full h-50 lg:h-100 bg-[#B5D5D2] border-none rounded-lg p-3 text-base text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-btn-primary/20 outline-none resize-none mb-3"
                                    placeholder="Write your message"
                                ></textarea>
                                <button className="px-5 py-2 bg-btn-primary text-white text-base font-medium rounded-lg hover:bg-teal-800 transition-colors">
                                    Send message
                                </button>
                            </div>
                        </div> */}
                    </div>

                    {/* Right Column */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location & Timing</h2>
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                            {(() => {
                                const venue = String(data.venueName || '').trim();
                                const street = String(data.addressLine1 || '').trim();
                                const town = String(data.townCity || '').trim();
                                const post = String(data.postcode || '').trim();
                                const locationLabel =
                                    [venue, street, town, post].filter(Boolean).join(', ') ||
                                    String(data.fullAddress || '').trim();
                                const mapsHref =
                                    String(data.googleMapLink || '').trim() ||
                                    (locationLabel
                                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`
                                        : '');

                                return locationLabel ? (
                                    <div className="text-base">
                                        {mapsHref ? (
                                            <a
                                                href={mapsHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-gray-900 underline-offset-2 hover:text-[#0F766E] hover:underline"
                                            >
                                                {locationLabel}
                                            </a>
                                        ) : (
                                            <span className="font-medium text-gray-900">{locationLabel}</span>
                                        )}
                                    </div>
                                ) : null;
                            })()}

                            <div className="space-y-4 text-base text-gray-900">
                                {data.sessionDays ? (
                                    <p className="flex items-center gap-2">
                                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center leading-none">
                                            <BlankCalendarIcon />
                                        </span>
                                        <span>{data.sessionDays}</span>
                                    </p>
                                ) : null}
                                {data.sessionTime ? (
                                    <p className="flex items-center gap-2">
                                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[1.125rem] leading-none">
                                            🕒
                                        </span>
                                        <span>{data.sessionTime}</span>
                                    </p>
                                ) : null}
                                {data.frequency ? (
                                    <p className="flex items-center gap-2">
                                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[1.125rem] leading-none">
                                            🔄
                                        </span>
                                        <span>{data.frequency}</span>
                                    </p>
                                ) : null}
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-6 h-50 w-full shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                {data.mapEmbedUrl ? (
                                    <iframe
                                        src={data.mapEmbedUrl}
                                        title="Map preview"
                                        className="h-full w-full border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : data.googleMapLink &&
                                  /\.(png|jpe?g|webp|gif)(\?|$)/i.test(String(data.googleMapLink)) ? (
                                    <img
                                        src={data.googleMapLink}
                                        alt="Map View"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full min-h-[12rem] items-center justify-center text-sm text-gray-400">
                                        Map View
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SportProviderListingDetails;