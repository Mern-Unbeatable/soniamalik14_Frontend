import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Code,
    AlertCircle,
    Eye,
    MessageSquare,
    TrendingUp,
    ExternalLink,
    ArrowLeft
} from 'lucide-react';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import {
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

const formatListValue = (value) => {
    if (Array.isArray(value)) {
        const normalized = value.map((item) => String(item || '').trim()).filter(Boolean);
        return normalized.length > 0 ? normalized.join(', ') : '';
    }
    return String(value || '').trim();
};

const hasValue = (value) => {
    if (typeof value === 'boolean') return true;
    return String(value || '').trim().length > 0 && String(value).trim().toLowerCase() !== 'n/a';
};

const DetailRow = ({ label, children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
        <span className="font-semibold text-gray-900">{label}</span>
        <div className="text-gray-700 min-w-0">{children}</div>
    </div>
);

const MapsLink = ({ href, label, children }) => {
    if (!href) {
        return <span>{children}</span>;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline-offset-2 hover:text-[#0F766E] hover:underline"
            aria-label={`Open ${label} in Google Maps`}
        >
            {children}
        </a>
    );
};

const resolveResponseType = (service) => {
    const responseType = String(service?.responseType || '').trim().toUpperCase();
    if (responseType === 'INTERESTED' || responseType === 'REGISTER_INTEREST') {
        return 'INTERESTED';
    }
    if (responseType === 'REGISTER') return 'REGISTER';

    const participantType = String(service?.participantResponseType || '').trim().toUpperCase();
    if (participantType === 'ALLOW_REGISTER_INTEREST') return 'INTERESTED';

    return 'REGISTER';
};

const buildGoogleMapsSearchUrl = (query) => {
    const normalized = String(query || '').trim();
    if (!normalized || normalized.toLowerCase() === 'n/a') return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const SERVICE_AVATAR_PLACEHOLDER = '/discover-placeholder.png';

const ServiceProviderListingDetails = () => {
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
        const responseType = resolveResponseType(service);

        const fullAddress = String(
            service?.fullAddress || service?.location || service?.addressLine1 || ''
        ).trim();
        const townCity = String(service?.city || service?.town || '').trim();
        const postcode = String(service?.postcode || '').trim();
        const listingHeadline = String(service?.listingHeadline || '').trim();
        const organizationName = String(service?.organizationName || '').trim();
        const bookingLink = String(service?.bookingLink || '').trim();
        const professionalRegistration = String(service?.professionalRegistration || '').trim();
        const primaryProfession = formatListValue(
            service?.role ||
                (Array.isArray(service?.providerType)
                    ? service.providerType
                    : service?.providerType)
        );

        return {
            id: service?.id,
            listing:
                listingHeadline ||
                organizationName ||
                service?.providerName ||
                'Untitled Listing',
            coach: service?.contactName || service?.provider?.name || service?.providerName || 'N/A',
            providerEmail:
                service?.providerEmail || service?.provider?.email || 'N/A',
            providerPhone:
                service?.providerPhone ||
                service?.provider?.phone ||
                service?.provider?.phoneNumber ||
                'N/A',
            status: normalizeStatus(service),
            engagement: null,
            avatar: resolveImageUrl(pickImageSource(service?.provider?.avatar), SERVICE_AVATAR_PLACEHOLDER),
            about: service?.aboutService || service?.description || 'No service details available.',
            clinicName: String(service?.clinicName || '').trim(),
            listingHeadline,
            organizationName,
            fullAddress,
            townCity,
            postcode,
            addressMapsUrl: buildGoogleMapsSearchUrl(fullAddress),
            townCityMapsUrl: buildGoogleMapsSearchUrl(townCity),
            postcodeMapsUrl: buildGoogleMapsSearchUrl(postcode),
            primaryProfession,
            sessionTypes: formatListValue(sessionTypes),
            sports: formatListValue(sports),
            suitableFor: formatListValue(suitableFor),
            whoCanTakePart: formatListValue(
                service?.whoCanTakePart ??
                    (typeof service?.womenOnly === 'boolean'
                        ? service.womenOnly
                            ? 'Women only'
                            : 'Mixed, women welcome'
                        : '')
            ),
            costMemebershipDetail: String(
                service?.costMemebershipDetail || service?.costMembershipDetail || ''
            ).trim(),
            professionalRegistration,
            bookingLink,
            insuranceInPlace:
                typeof service?.insuranceInPlace === 'boolean'
                    ? service.insuranceInPlace
                        ? 'Yes'
                        : 'No'
                    : '',
            responseType,
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
        <div className="flex-1 overflow-auto bg-gray-50 min-h-screen relative font-sans">



            <div className=" p-6 md:p-10 space-y-8">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-btn-primary hover:text-teal-800 font-medium transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-base">Back to Listings</span>
                </button>

                {/* Header Section */}
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#1a1a1a] shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
                        <img
                            src={data.avatar}
                            alt={data.listing}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageLoadError(e, SERVICE_AVATAR_PLACEHOLDER)}
                        />
                    </div>

                    {/* Title & Stats */}
                    <div className="pt-1">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1.5">{data.listing}</h1>
                        <p className="text-base text-gray-600 font-medium mb-1">
                            Coach: <span className="text-gray-900 font-semibold">{data.coach}</span>
                        </p>
                        <p className="text-base text-gray-600 font-medium mb-1">
                            Provider email:{' '}
                            {data.providerEmail !== 'N/A' ? (
                                <a
                                    href={`mailto:${data.providerEmail}`}
                                    className="font-semibold text-gray-900 underline-offset-2 hover:text-[#0F766E] hover:underline"
                                >
                                    {data.providerEmail}
                                </a>
                            ) : (
                                <span className="text-gray-900 font-semibold">{data.providerEmail}</span>
                            )}
                        </p>
                        <p className="text-base text-gray-600 font-medium mb-3">
                            Provider phone:{' '}
                            {data.providerPhone !== 'N/A' ? (
                                <a
                                    href={`tel:${String(data.providerPhone).replace(/\s/g, '')}`}
                                    className="font-semibold text-gray-900 underline-offset-2 hover:text-[#0F766E] hover:underline"
                                >
                                    {data.providerPhone}
                                </a>
                            ) : (
                                <span className="text-gray-900 font-semibold">{data.providerPhone}</span>
                            )}
                        </p>

                        {/* Mini Stats (Only show if engagement data exists) */}
                        {data.engagement && (
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {data.engagement.views}</span>
                                <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {data.engagement.trend}</span>
                                <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {data.engagement.messages}</span>
                                <span className="flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5" /> {data.engagement.shares}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Banned Status Alert Banner */}
                {data.status === 'Banned' && (
                    <div className="bg-red-50/80 border border-red-100 rounded-xl p-5 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-base font-semibold text-red-600 mb-1">This event was not approved</h3>
                            <p className="text-xs leading-relaxed text-red-500">
                                Your event could not be published because it does not meet our community or safety guidelines.<br />
                                Please review the feedback below, make the required changes, and submit again.
                            </p>
                        </div>
                    </div>
                )}

                {/* About This Service */}
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-2xl">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">About This Service</h2>
                    <p className="text-base text-gray-600 leading-relaxed">
                        {data.about}
                    </p>
                </div>

                {/* Service Details List */}
                {(hasValue(data.clinicName) ||
                    hasValue(data.listingHeadline) ||
                    hasValue(data.organizationName) ||
                    hasValue(data.fullAddress) ||
                    hasValue(data.townCity) ||
                    hasValue(data.postcode) ||
                    hasValue(data.primaryProfession) ||
                    hasValue(data.sessionTypes) ||
                    hasValue(data.sports) ||
                    hasValue(data.suitableFor) ||
                    hasValue(data.costMemebershipDetail) ||
                    hasValue(data.professionalRegistration) ||
                    hasValue(data.bookingLink) ||
                    hasValue(data.insuranceInPlace)) && (
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-2xl">
                    <div className="space-y-4">
                        {hasValue(data.clinicName) ? (
                            <DetailRow label="Clinic Name:">{data.clinicName}</DetailRow>
                        ) : null}

                        {hasValue(data.listingHeadline) ? (
                            <DetailRow label="Listing Headline:">{data.listingHeadline}</DetailRow>
                        ) : null}

                        {hasValue(data.organizationName) ? (
                            <DetailRow label="Organization Name:">{data.organizationName}</DetailRow>
                        ) : null}

                        {hasValue(data.fullAddress) ? (
                            <DetailRow label="Address:">
                                <MapsLink href={data.addressMapsUrl} label={data.fullAddress}>
                                    {data.fullAddress}
                                </MapsLink>
                            </DetailRow>
                        ) : null}

                        {hasValue(data.townCity) ? (
                            <DetailRow label="Town/City:">
                                <MapsLink href={data.townCityMapsUrl} label={data.townCity}>
                                    {data.townCity}
                                </MapsLink>
                            </DetailRow>
                        ) : null}

                        {hasValue(data.postcode) ? (
                            <DetailRow label="Postcode:">
                                <MapsLink href={data.postcodeMapsUrl} label={data.postcode}>
                                    {data.postcode}
                                </MapsLink>
                            </DetailRow>
                        ) : null}

                        {hasValue(data.primaryProfession) ? (
                            <DetailRow label="Primary Profession:">{data.primaryProfession}</DetailRow>
                        ) : null}

                        {hasValue(data.sessionTypes) ? (
                            <DetailRow label="Session Types:">{data.sessionTypes}</DetailRow>
                        ) : null}

                        {hasValue(data.sports) ? (
                            <DetailRow label="Sports:">{data.sports}</DetailRow>
                        ) : null}

                        {hasValue(data.suitableFor) ? (
                            <DetailRow label="Suitable for:">{data.suitableFor}</DetailRow>
                        ) : null}

                        {hasValue(data.costMemebershipDetail) ? (
                            <DetailRow label="Cost / membership:">
                                <span className="whitespace-pre-line">{data.costMemebershipDetail}</span>
                            </DetailRow>
                        ) : null}

                        {hasValue(data.professionalRegistration) ? (
                            <DetailRow label="Professional Registration:">
                                {data.professionalRegistration}
                            </DetailRow>
                        ) : null}

                        {hasValue(data.bookingLink) ? (
                            <DetailRow label="Booking Link:">
                                <a
                                    href={data.bookingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="break-all underline-offset-2 hover:text-[#0F766E] hover:underline"
                                >
                                    {data.bookingLink}
                                </a>
                            </DetailRow>
                        ) : null}

                        {hasValue(data.insuranceInPlace) ? (
                            <DetailRow label="Insurance in place:">{data.insuranceInPlace}</DetailRow>
                        ) : null}
                    </div>
                </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    {data.responseType === 'INTERESTED' ? (
                        <button className="px-5 py-2.5 bg-btn-primary text-white text-sm md:text-base font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                            Register Interest
                        </button>
                    ) : (
                        <button className="px-5 py-2.5 bg-btn-primary text-white text-sm md:text-base font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                            Register
                        </button>
                    )}
                </div>

                 {/* Contact Organiser */}
                        {/* <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Organiser</h2>
                            <div className="bg-[#E7F1F1] p-4 rounded-xl border border-gray-100 max-w-2xl">
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
        </div>
    );
};

export default ServiceProviderListingDetails;