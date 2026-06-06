import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import BookingsTable from '../../shared/eventAnalytics/components/BookingsTable';
import EnquiriesTable from '../../coach/recruitment/components/EnquiriesTable';

const ServiceDetails = () => {
    const { id } = useParams();
    const { state } = useLocation();

    const [item, setItem] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadServiceDetail = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await GET(ENDPOINT.SERVICES.DETAIL(id));
                let payload = res?.data;
                if (payload?.data) payload = payload.data;
                if (payload?.service) payload = payload.service;

                if (mounted) setItem(payload || null);
            } catch (err) {
                if (mounted) setError(err?.response?.data?.message || err.message || 'Failed to load service');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadServiceDetail();
        return () => { mounted = false; };
    }, [id]);

    useEffect(() => {
        let mounted = true;

        const loadBookings = async () => {
            setBookingsLoading(true);
            try {
                const res = await GET(ENDPOINT.SERVICES.BOOKINGS(id));
                const axiosData = res?.data;
                const backendData = axiosData?.data || axiosData;
                const bookingsWrapper = backendData?.bookings;
                const innerData = bookingsWrapper?.data || bookingsWrapper;
                const bookingsArr = innerData?.bookings ?? [];
                const statsObj = innerData?.stats ?? null;

                if (mounted) {
                    setBookings(Array.isArray(bookingsArr) ? bookingsArr : []);
                    setStats(statsObj);
                }
            } catch (err) {
                if (mounted) setBookings([]);
            } finally {
                if (mounted) setBookingsLoading(false);
            }
        };

        loadBookings();
        return () => { mounted = false; };
    }, [id]);


    useEffect(() => {
        let mounted = true;

        const loadMessages = async () => {
            setMessagesLoading(true);
            try {
                const res = await GET(ENDPOINT.SERVICES.MESSAGES(id));
                const axiosData = res?.data;
                const backendData = axiosData?.data || axiosData;
                const messagesArr = backendData?.messages ?? [];

                if (mounted) {
                    setMessages(Array.isArray(messagesArr) ? messagesArr : []);
                }
            } catch (err) {
                if (mounted) setMessages([]);
            } finally {
                if (mounted) setMessagesLoading(false);
            }
        };

        loadMessages();
        return () => { mounted = false; };
    }, [id]);

    const backTarget = '/provider/service';

    if (loading) return <div className="dashboardPy">Loading service...</div>;
    if (error) return <div className="dashboardPy text-red-600">Error: {error}</div>;
    if (!item) return <div className="dashboardPy">Service not found.</div>;

    const heroImage = item?.logo || item?.image;

    const mappedEnquiries = messages.map((m) => ({
        id: m.id,
        name: m.sender?.name || 'Unknown',
        phone: m.sender?.phone?.trim() || '—',
        email: m.sender?.email || '—',
        msg: m.message || '—',
        date: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : '—',
    }));

    const mappedBookings = bookings.map((b) => ({
        name: b.fullName || b.user?.name || b.name || 'Guest',
        phone: b.phoneNumber?.trim() || b.user?.phone?.trim() || b.phone?.trim() || '—',
        email: b.email || b.user?.email || '—',
        status: b.status || '—',
        date: b.bookingDate
            ? new Date(b.bookingDate).toLocaleDateString('en-GB')
            : b.createdAt
                ? new Date(b.createdAt).toLocaleDateString('en-GB')
                : '—',
    }));

    return (
        <div className="dashboardPy dashboardSpaceY text-gray-800">
            {/* Back Button */}
            <div className="mb-4">
                <Link
                    to={backTarget}
                    className="inline-flex items-center text-base font-medium text-teal-600 hover:text-teal-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Link>
            </div>

            {/* Hero Image */}
            <div className="w-full h-64 md:h-[620px] relative object-cover rounded-xl overflow-hidden mb-6">
                {heroImage && !imageError ? (
                    <img
                        src={heroImage}
                        alt={item.listingHeadline || item.name || item.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <span>No image</span>
                    </div>
                )}
            </div>

            {/* Service Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {item.listingHeadline || item.name || item.title}
            </h1>

            {/* Metadata Fields */}
            <div className="space-y-3 text-base text-gray-800 mb-8">
                <div>
                    <span className="block text-gray-900">
                        <span className="font-semibold">Category: </span>
                        {item.category || item.type || item.serviceType || 'N/A'}
                    </span>
                </div>
                <div>
                    <span className="block text-gray-900">
                        <span className="font-semibold">Status: </span>
                        {item.status || 'Active'}
                    </span>
                </div>
                <div>
                    <span className="block text-gray-900">
                        <span className="font-semibold">Visibility: </span>
                        {item.isApproved ? 'Live' : 'Pending Approval'}
                    </span>
                </div>
                <div>
                    <span className="block text-gray-900">
                        <span className="font-semibold">Available Days: </span>
                        {Array.isArray(item.availableDays) && item.availableDays.length > 0
                            ? item.availableDays.join(', ')
                            : item.availableDays || item.days || 'Not specified'}
                    </span>
                </div>
            </div>

            {/* About This Service */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Service</h2>
                <div className="text-base md:w-2xl text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.aboutService || item.description || 'No description available.'}
                </div>
            </div>

            {/* Who This Service Is For */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Who This Service Is For</h2>
                {item.whoServiceFor ? (
                    <div className="text-base text-gray-700">{item.whoServiceFor}</div>
                ) : Array.isArray(item.sports) && item.sports.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {item.sports.map((sport, idx) => (
                            <span key={idx} className="rounded-full bg-[#E7F1F1] px-3 py-1 text-sm text-[#0F766E]">
                                {sport}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="text-base text-gray-600">Not specified.</div>
                )}
            </div>

            {/* Booking Stats Summary */}
            {stats && (
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                        { label: 'Total', value: stats.total },
                        { label: 'Pending', value: stats.pending },
                        { label: 'Confirmed', value: stats.confirmed },
                        { label: 'Completed', value: stats.completed },
                        { label: 'Cancelled', value: stats.cancelled },
                        { label: 'Revenue', value: `£${stats.totalRevenue ?? 0}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm text-center">
                            <p className="text-2xl font-bold text-[#0F766E]">{value}</p>
                            <p className="mt-0.5 text-sm text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Bookings Table */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Bookings</h2>

                {bookingsLoading ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
                        Loading bookings…
                    </div>
                ) : mappedBookings.length > 0 ? (
                    <BookingsTable bookings={mappedBookings} resultsPerPage={6} />
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                        <p className="text-gray-500 text-base">No bookings yet.</p>
                    </div>
                )}
            </div>

            {/* Enquiries / Messages Table */}
            <div className="mb-8">
                {messagesLoading ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
                        Loading enquiries…
                    </div>
                ) : (
                    <EnquiriesTable data={mappedEnquiries} />
                )}
            </div>
        </div>
    );
};

export default ServiceDetails;
