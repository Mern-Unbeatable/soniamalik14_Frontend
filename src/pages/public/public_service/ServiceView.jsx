import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../../components/layout/Container';
import ServiceCard from './components/ServiceCard';
import Pagination from '../../../components/ui/Pagination';
import PageHeader from '../../../components/ui/PageHeader';
import { GET } from '../../../services/httpMethods';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const SERVICE_BY_ROLE_API = '/api/services/by-role';

const toServiceCardItem = (service) => {
    const sessionTypes = Array.isArray(service?.sessionTypes) ? service.sessionTypes.filter(Boolean) : [];
    const sports = Array.isArray(service?.sports) ? service.sports.filter(Boolean) : [];
    const providerTypes = Array.isArray(service?.providerType)
        ? service.providerType.filter(Boolean)
        : [];

    return {
        id: service?.id,
        title:
            service?.listingHeadline ||
            service?.providerName ||
            service?.organizationName ||
            'Service Provider',
        titleColor: '#0B544E',
        description:
            service?.description ||
            service?.aboutService ||
            'Professional support tailored to your sport and recovery needs.',
        type: providerTypes[0] || sessionTypes[0] || 'Service',
        sport: sports[0] || 'General',
        image: service?.logo || service?.provider?.avatar || '',
        location: service?.location || service?.city || '',
        postcode: service?.postcode || '',
    };
};

const ServiceView = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [postcode, setPostcode] = useState('');
    const [distance, setDistance] = useState('');
    const [selectedService, setSelectedService] = useState('All');
    const itemsPerPage = 3;

    useEffect(() => {
        const controller = new AbortController();

        const fetchServices = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await GET(
                    SERVICE_BY_ROLE_API,
                    { status: 'ACTIVE', providerRole: 'PROVIDER' },
                    controller.signal,
                    { skipAuth: true, withCredentials: false }
                );

                const serviceList = Array.isArray(response?.data?.data)
                    ? response.data.data
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

                setServices(serviceList.map(toServiceCardItem));
            } catch (err) {
                if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
                setError(err?.response?.data?.message || err?.message || 'Failed to load services.');
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();

        return () => controller.abort();
    }, []);

    const serviceTypeOptions = useMemo(() => {
        const unique = new Set(
            services
                .map((item) => item.type)
                .filter((type) => type && String(type).trim().length > 0)
        );

        return ['All', ...Array.from(unique)];
    }, [services]);

    const filtered = useMemo(() => {
        return services.filter((item) => {
            const serviceMatch =
                selectedService === 'All' ||
                selectedService === '' ||
                item.type?.toLowerCase() === selectedService.toLowerCase();

            const search = postcode.trim().toLowerCase();
            const locationMatch =
                !search ||
                item.location?.toLowerCase().includes(search) ||
                item.postcode?.toLowerCase().includes(search);

            if (distance) {
                return serviceMatch && locationMatch;
            }

            return serviceMatch && locationMatch;
        });
    }, [services, selectedService, postcode, distance]);

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedServices = filtered.slice(startIndex, endIndex);

    return (
        <section className="py-6 lg:py-10 bg-[#F8FAFC] ">
            <Container>
                {/* Header Section */}
                <div className="mb-6">
                    <PageHeader title="Services" description={"Support for your journey - from injury recovery to nutrition guidance. Professionals supporting women at every level."} />
                </div>

                {/* Filter Bar (Matches the design from the image) */}
                <div className="mb-4 bg-[#E7F1F1] p-4 rounded-lg inline-flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    {/* Postcode/City Input */}
                    <input
                        type="text"
                        placeholder="Enter Postcode/City"
                        value={postcode}
                        onChange={(e) => {
                            setPostcode(e.target.value);
                            setPage(1);
                        }}
                        className="w-full sm:w-55 bg-white border-none text-gray-700 text-base rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-teal-500 shadow-sm placeholder-gray-400"
                    />

                    {/* Distance Dropdown */}
                    <div className="relative w-full sm:w-35">
                        <select
                            value={distance}
                            onChange={(e) => {
                                setDistance(e.target.value);
                                setPage(1);
                            }}
                            className="appearance-none w-full bg-white border-none text-gray-700 text-base rounded-md px-3 py-3 outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-sm"
                        >
                            <option value="">Distance</option>
                            <option value="5">5 Miles</option>
                            <option value="10">10 Miles</option>
                            <option value="20">20 Miles</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Select Services Dropdown */}
                    <div className="relative w-full sm:w-45">
                        <select
                            value={selectedService}
                            onChange={(e) => { setSelectedService(e.target.value); setPage(1); }}
                            className="appearance-none w-full bg-white border-none text-gray-700 text-base rounded-md px-3 py-3 outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-sm"
                        >
                            {serviceTypeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option === 'All' ? 'Select Services' : option}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                </div>

                {/* Content Grid */}
                {loading ? (
                    <LoadingSpinner label="Services are loading..." />
                ) : error ? (
                    <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : filtered.length > 0 ? (
                    <>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedServices.map((item) => (
                                <ServiceCard key={item.id} item={item} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-4 flex justify-center">
                                <Pagination page={page} total={totalPages} onChange={(p) => setPage(p)} />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="text-center">
                            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-[#1A1D1F] mb-2">No Services Found</h3>
                            <p className="text-[#4A5565] text-base mb-4">
                                We couldn't find any {selectedService !== 'All' ? selectedService.toLowerCase() : 'services'} matching your search.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedService('All');
                                    setPostcode('');
                                    setDistance('');
                                    setPage(1);
                                }}
                                className="text-[#147B6B] hover:text-[#0d655d] font-medium text-base transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Disclaimer Footer Note */}
                <div className="mt-8 bg-[#EFF5F6] text-[#4A5565] text-base p-4 rounded-lg text-center max-w-xl mx-auto leading-relaxed border border-[#E7F1F1]">
                    Providers listed on ESSA Hub are independent professionals. Members are encouraged to carry out their own checks before engaging services.
                </div>
            </Container>
        </section>
    );
};

export default ServiceView;





