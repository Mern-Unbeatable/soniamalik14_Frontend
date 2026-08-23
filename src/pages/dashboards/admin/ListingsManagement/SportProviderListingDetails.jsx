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

        return {
            id: service?.id,
            listing:
                service?.listingHeadline ||
                service?.organizationName ||
                service?.providerName ||
                service?.clinicName ||
                'Untitled Listing',
            coach: service?.contactName || service?.provider?.name || service?.providerName || 'N/A',
            status: normalizeStatus(service),
            engagement: null,
            coverImage: resolveImageUrl(
                pickImageSource(service?.coverImage, service?.image, service?.logo),
                DUMMY_IMAGE_PATH
            ),
            avatar: resolveImageUrl(
                pickImageSource(service?.provider?.avatar),
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
            venueName: service?.clinicName || service?.fullAddress || service?.location || 'Not specified',
            postcode: service?.postcode || 'Not specified',
            townCity: service?.city || service?.location || 'Not specified',
            sessionDays:
                service?.sessonDay ||
                (days.length > 0 ? days.join(', ') : '') ||
                (service?.date ? `Date: ${formatReadableDate(service.date)}` : 'Not specified'),
            sessionTime:
                service?.timeSlote ||
                (service?.duration ? `${service.duration} mins` : 'Not specified'),
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
                        onError={(e) => handleImageLoadError(e, DUMMY_IMAGE_PATH)}
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
                            alt="Coach"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                            onError={(e) => handleImageLoadError(e, DUMMY_IMAGE_PATH)}
                        />
                    </div>
                </div>

                {/* Header Info */}
                <div className="pt-10 px-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">{data.listing}</h1>
                    <p className="text-base text-gray-600 font-medium mb-3">Coach: <span className="text-gray-900 text-lg">{data.coach}</span></p>

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
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Session Details</h2>
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
                                {/* Overview Card 4 */}
                                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="p-2 bg-[#E7F1F1] rounded-full text-[#00786F]"><Users className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">Women's only</p>
                                        <p className="text-base text-gray-500">{data.womenOnly}</p>
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location & Timing.</h2>
                        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                            <div className="grid grid-cols-[100px_1fr] gap-2 text-base">
                                {/* <span className="text-gray-500">Venue Name:</span>
                                <span className="text-gray-900 font-medium">{data.venueName}</span> */}

                                {/* <span className="text-gray-500">Postcode:</span> */}
                                {data.postcodeMapsUrl ? (
                                    <a
                                        href={data.postcodeMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-gray-900 underline-offset-2 hover:text-[#0F766E] hover:underline"
                                        aria-label={`Open ${data.postcode} in Google Maps`}
                                    >
                                        {data.postcode}
                                    </a>
                                ) : (
                                    <span className="font-medium text-gray-900">{data.postcode}</span>
                                )}

                                {/* <span className="text-gray-500">Town/City:</span> */}
                                {data.townCityMapsUrl ? (
                                    <a
                                        href={data.townCityMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-gray-900 underline-offset-2 hover:text-[#0F766E] hover:underline"
                                        aria-label={`Open ${data.townCity} in Google Maps`}
                                    >
                                        {data.townCity}
                                    </a>
                                ) : (
                                    <span className="font-medium text-gray-900">{data.townCity}</span>
                                )}

                                {/* <span className="text-gray-500">Day:</span> */}
                                <span className="text-gray-900 font-medium">{data.sessionDays}</span>

                                {/* <span className="text-gray-500">Time:</span> */}
                                <span className="text-gray-900 font-medium">{data.sessionTime}</span>
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