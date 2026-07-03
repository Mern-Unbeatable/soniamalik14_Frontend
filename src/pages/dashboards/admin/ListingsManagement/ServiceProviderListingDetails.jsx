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

const normalizeStatus = (service) => {
    if (service?.bannedAt || service?.bannedReason) return 'Banned';
    if (service?.isFeatured) return 'Featured';

    const normalized = String(service?.status || '').trim().toLowerCase();
    if (['active', 'approved', 'live'].includes(normalized)) return 'Live';
    if (['pending', 'pending_approval'].includes(normalized)) return 'Pending';
    if (['banned', 'blocked', 'rejected'].includes(normalized)) return 'Banned';

    return 'Pending';
};

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

        return {
            id: service?.id,
            listing: service?.listingHeadline || service?.organizationName || service?.providerName || 'Untitled Listing',
            coach: service?.contactName || service?.provider?.name || service?.providerName || 'N/A',
            status: normalizeStatus(service),
            engagement: null,
            avatar: service?.provider?.avatar || service?.logo || '',
            about: service?.aboutService || service?.description || 'No service details available.',
            clinicName: service?.clinicName || 'N/A',
            addressLine1: service?.addressLine1 || 'N/A',
            townCity: service?.city || 'N/A',
            postcode: service?.postcode || 'N/A',
            primaryProfession:
                service?.role ||
                (Array.isArray(service?.providerType) ? service.providerType.join(', ') : service?.providerType) ||
                'N/A',
            sessionTypes: sessionTypes.length > 0 ? sessionTypes.join(', ') : 'N/A',
            sport: sports.length > 0 ? sports.join(', ') : 'N/A',
            professionalRegistration: service?.professionalRegistration || 'N/A',
            insuranceInPlace:
                typeof service?.insuranceInPlace === 'boolean'
                    ? service.insuranceInPlace
                        ? 'Yes'
                        : 'No'
                    : 'N/A',
            participantResponseType: service?.participantResponseType || 'ADD_BOOKING_LINK',
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
                <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1a1a1a] shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
                        <img
                            src={data.avatar || 'https://ui-avatars.com/api/?name=W+S&background=1a1a1a&color=b4855d&font-size=0.4'}
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Title & Stats */}
                    <div className="pt-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">{data.listing}</h1>
                        <p className="text-base text-gray-600 font-medium mb-3">Coach: <span className="text-gray-900 font-semibold">{data.coach}</span></p>

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
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-2xl">
                    <div className="space-y-4">
                        {/* Using Grid to ensure perfect alignment and no text breaking below the label */}
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Clinic Name:</span>
                            <span className="text-gray-700">{data.clinicName}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Address line 1:</span>
                            <span className="text-gray-700">{data.addressLine1}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Town/City:</span>
                            <span className="text-gray-700">{data.townCity}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Postcode:</span>
                            <span className="text-gray-700">{data.postcode}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Primary Profession:</span>
                            <span className="text-gray-700">{data.primaryProfession}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Session Types:</span>
                            <span className="text-gray-700">{data.sessionTypes}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Sport:</span>
                            <span className="text-gray-700">{data.sport}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Professional Registration:</span>
                            <span className="text-gray-700">{data.professionalRegistration}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 text-base">
                            <span className="font-semibold text-gray-900">Insurance in place:</span>
                            <span className="text-gray-700">{data.insuranceInPlace}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    {data.participantResponseType !== 'ALLOW_REGISTER_INTEREST' ? (
                        <button className="px-5 py-2.5 bg-btn-primary text-white text-sm md:text-base font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                            Register
                        </button>
                    ) : (
                        <button className="px-5 py-2.5 bg-btn-primary text-white text-sm md:text-base font-semibold rounded-lg hover:bg-teal-800 transition-colors">
                            Register Interest
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