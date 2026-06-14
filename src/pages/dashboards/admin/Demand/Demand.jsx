import React, { useState, useMemo, useEffect } from 'react';
import DemandHeader from './components/DemandHeader';
import DemandTabs from './components/DemandTabs';
import DemandFilters from './components/DemandFilters';
import DemandAccountPreferencesTable from './components/DemandAccountPreferencesTable';
import DemandRegisterInterestTable from './components/DemandRegisterInterestTable';
import DemandMissingSportsTable from './components/DemandMissingSportsTable';
import DemandContactMetadataTable from './components/DemandContactMetadataTable';
import DemandPagination from './components/DemandPagination';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';

const DemandSignals = () => {
    // State for Tabs and Filters
    const [activeTab, setActiveTab] = useState('Register Interest');
    const [riSearchQuery, setRiSearchQuery] = useState('');
    const [riFilter, setRiFilter] = useState('All');

    // API Data for Missing Sports tab
    const [missingSports, setMissingSports] = useState([]);
    const [loadingMissingSports, setLoadingMissingSports] = useState(false);
    const [errorMissingSports, setErrorMissingSports] = useState(null);
    const [msPage, setMsPage] = useState(1);
    const msLimit = 6;

    const msTotalResults = missingSports.length;
    const msTotalPages = Math.max(1, Math.ceil(msTotalResults / msLimit));
    const paginatedMissingSports = useMemo(() => {
        const startIndex = (msPage - 1) * msLimit;
        return missingSports.slice(startIndex, startIndex + msLimit);
    }, [missingSports, msPage, msLimit]);

    // API Data for Register Interest tab
    const [registerInterests, setRegisterInterests] = useState([]);
    const [loadingRegisterInterests, setLoadingRegisterInterests] = useState(false);
    const [errorRegisterInterests, setErrorRegisterInterests] = useState(null);
    const [riPage, setRiPage] = useState(1);
    const [riPagination, setRiPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // API Data for Contact Metadata tab
    const [contactMetadata, setContactMetadata] = useState([]);
    const [loadingContactMetadata, setLoadingContactMetadata] = useState(false);
    const [errorContactMetadata, setErrorContactMetadata] = useState(null);
    const [cmPage, setCmPage] = useState(1);
    const [cmPagination, setCmPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });

    const tabs = [/* 'Account Preferences', */ 'Register Interest', 'Missing Sports', 'Contact Metadata'];

    // Debounce search query to avoid redundant API hits while typing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(riSearchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [riSearchQuery]);

    // Reset page when filter or search query changes
    useEffect(() => {
        setRiPage(1);
    }, [debouncedSearchQuery, riFilter]);

    useEffect(() => {
        setMsPage(1);
    }, [activeTab]);

    useEffect(function initMissingSports() {
        if (activeTab !== 'Missing Sports') return;

        const fetchMissingSports = async () => {
            setLoadingMissingSports(true);
            setErrorMissingSports(null);
            try {
                const response = await GET(ENDPOINT.INTEREST_REQUESTS.ADMIN_ALL);
                const payload = response?.data || response;
                if (payload?.success && Array.isArray(payload?.data)) {
                    setMissingSports(payload.data);
                } else if (Array.isArray(payload)) {
                    setMissingSports(payload);
                } else {
                    setMissingSports([]);
                }
            } catch (err) {
                console.error('Error fetching admin missing sports requests:', err);
                setErrorMissingSports(err?.response?.data?.message || 'Failed to load missing sports');
            } finally {
                setLoadingMissingSports(false);
            }
        };

        fetchMissingSports();
    }, [activeTab]);

    const mapRegisterInterest = (item) => {
        let userVal = 'Unknown User';
        if (item?.user) {
            if (typeof item.user === 'object') {
                userVal = item.user.name || item.user.email || item.user.username ;
            } else {
                userVal = item.user;
            }
        } else if (item?.userName) {
            userVal = item.userName;
        } else if (item?.userId) {
            userVal = item.userId;
        }

        let listingVal = 'Untitled Listing';
        const serviceObj = item?.service || item?.listing || item;
        if (serviceObj) {
            if (typeof serviceObj === 'object') {
                listingVal = serviceObj.listingHeadline || serviceObj.title || serviceObj.name || 'Untitled Listing';
            } else {
                listingVal = serviceObj;
            }
        }

        let sportVal = 'N/A';
        if (item?.sport) {
            sportVal = item.sport;
        } else if (item?.service?.sports) {
            sportVal = Array.isArray(item.service.sports) ? item.service.sports.join(', ') : item.service.sports;
        } else if (item?.listing?.sports) {
            sportVal = Array.isArray(item.listing.sports) ? item.listing.sports.join(', ') : item.listing.sports;
        } else if (item?.service?.sport) {
            sportVal = item.service.sport;
        } else if (item?.listing?.sport) {
            sportVal = item.listing.sport;
        }

        let locationVal = 'N/A';
        if (item?.location) {
            locationVal = item.location;
        } else if (item?.postcode) {
            locationVal = item.postcode;
        } else if (item?.service?.postcode || item?.service?.location) {
            locationVal = item.service.postcode || item.service.location;
        } else if (item?.listing?.postcode || item?.listing?.location) {
            locationVal = item.listing.postcode || item.listing.location;
        }

        let dateVal = 'N/A';
        const rawDate = item?.date || item?.createdAt;
        if (rawDate) {
            try {
                const d = new Date(rawDate);
                dateVal = d.toLocaleDateString('en-GB');
            } catch {
                dateVal = rawDate;
            }
        }

        let responseTimeVal = item?.responseTime || 'N/A';

        let providerVal = 'N/A';
        if (item?.provider) {
            if (typeof item.provider === 'object') {
                providerVal = item.provider.name || 'N/A';
            } else {
                providerVal = item.provider;
            }
        } else if (item?.service?.provider?.name || item?.service?.providerName) {
            providerVal = item.service.provider.name || item.service.providerName;
        } else if (item?.listing?.provider?.name || item?.listing?.providerName) {
            providerVal = item.listing.provider.name || item.listing.providerName;
        }

        let statusVal = item?.status || 'Pending';
        if (statusVal === 'PENDING') statusVal = 'Pending';
        if (statusVal === 'CONTACTED') statusVal = 'Contacted';

        return {
            id: item?._id || item?.id || Math.random().toString(),
            user: userVal,
            listing: listingVal,
            sport: sportVal,
            location: locationVal,
            date: dateVal,
            responseTime: responseTimeVal,
            provider: providerVal,
            status: statusVal,
        };
    };

    useEffect(function initRegisterInterests() {
        if (activeTab !== 'Register Interest') return;

        const fetchRegisterInterests = async () => {
            setLoadingRegisterInterests(true);
            setErrorRegisterInterests(null);
            try {
                const queryParams = {
                    page: riPage,
                    limit: 20
                };
                if (debouncedSearchQuery) {
                    queryParams.search = debouncedSearchQuery;
                }
                if (riFilter !== 'All') {
                    queryParams.status = riFilter === 'Not Contacted' ? 'Pending' : riFilter;
                }

                const response = await GET(ENDPOINT.ADMIN.REGISTER_INTERESTS, queryParams);
                const payload = response?.data || response;
                if (payload?.success && payload?.data) {
                    const rawData = Array.isArray(payload.data.data) ? payload.data.data : [];
                    const mapped = rawData.map(mapRegisterInterest);
                    setRegisterInterests(mapped);
                    setRiPagination(payload.data.pagination || {
                        total: rawData.length,
                        page: riPage,
                        limit: 20,
                        totalPages: Math.ceil(rawData.length / 20)
                    });
                } else if (Array.isArray(payload?.data)) {
                    const mapped = payload.data.map(mapRegisterInterest);
                    setRegisterInterests(mapped);
                    setRiPagination({
                        total: mapped.length,
                        page: riPage,
                        limit: 20,
                        totalPages: Math.ceil(mapped.length / 20)
                    });
                } else {
                    setRegisterInterests([]);
                }
            } catch (err) {
                console.error('Error fetching admin register interests:', err);
                setErrorRegisterInterests(err?.response?.data?.message || 'Failed to load register interests');
            } finally {
                setLoadingRegisterInterests(false);
            }
        };

        fetchRegisterInterests();
    }, [activeTab, riPage, debouncedSearchQuery, riFilter]);

    useEffect(function initContactMetadata() {
        if (activeTab !== 'Contact Metadata') return;

        const fetchContactMetadata = async () => {
            setLoadingContactMetadata(true);
            setErrorContactMetadata(null);
            try {
                const queryParams = {
                    page: cmPage,
                    limit: 20
                };
                const response = await GET(ENDPOINT.ADMIN.CONTACT_METADATA, queryParams);
                const payload = response?.data || response;
                if (payload?.success && payload?.data) {
                    const rawData = Array.isArray(payload.data.data) ? payload.data.data : [];
                    setContactMetadata(rawData);
                    setCmPagination(payload.data.pagination || {
                        total: rawData.length,
                        page: cmPage,
                        limit: 20,
                        totalPages: Math.ceil(rawData.length / 20)
                    });
                } else if (Array.isArray(payload?.data)) {
                    setContactMetadata(payload.data);
                    setCmPagination({
                        total: payload.data.length,
                        page: cmPage,
                        limit: 20,
                        totalPages: Math.ceil(payload.data.length / 20)
                    });
                } else {
                    setContactMetadata([]);
                }
            } catch (err) {
                console.error('Error fetching admin contact metadata:', err);
                setErrorContactMetadata(err?.response?.data?.message || 'Failed to load contact metadata');
            } finally {
                setLoadingContactMetadata(false);
            }
        };

        fetchContactMetadata();
    }, [activeTab, cmPage]);



    return (
        <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
            <div className="">

                {/* 1. Header Section */}
                <DemandHeader />

                {/* 2. Tabs Section */}
                <DemandTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

                {/* 3. Dynamic Filters Area - Only for Register Interest */}
                {activeTab === 'Register Interest' && (
                    <DemandFilters
                        riSearchQuery={riSearchQuery}
                        setRiSearchQuery={setRiSearchQuery}
                        riFilter={riFilter}
                        setRiFilter={setRiFilter}
                    />
                )}

                {/* 4. Table Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* {activeTab === 'Account Preferences' && <DemandAccountPreferencesTable data={accountPreferencesData} />} */}
                        {activeTab === 'Register Interest' && (
                            <DemandRegisterInterestTable 
                                data={registerInterests} 
                                loading={loadingRegisterInterests} 
                                error={errorRegisterInterests} 
                            />
                        )}
                        {activeTab === 'Missing Sports' && (
                            <DemandMissingSportsTable 
                                data={paginatedMissingSports} 
                                loading={loadingMissingSports} 
                                error={errorMissingSports} 
                            />
                        )}
                        {activeTab === 'Contact Metadata' && (
                            <DemandContactMetadataTable 
                                data={contactMetadata} 
                                loading={loadingContactMetadata} 
                                error={errorContactMetadata} 
                            />
                        )}
                    </div>

                    {/* Pagination */}
                    {activeTab === 'Register Interest' && (
                        <DemandPagination
                            currentPage={riPage}
                            totalPages={riPagination.totalPages}
                            totalResults={riPagination.total}
                            limit={riPagination.limit}
                            onPageChange={setRiPage}
                        />
                    )}
                    {activeTab === 'Missing Sports' && (
                        <DemandPagination
                            currentPage={msPage}
                            totalPages={msTotalPages}
                            totalResults={msTotalResults}
                            limit={msLimit}
                            onPageChange={setMsPage}
                        />
                    )}
                    {activeTab === 'Contact Metadata' && (
                        <DemandPagination
                            currentPage={cmPage}
                            totalPages={cmPagination.totalPages}
                            totalResults={cmPagination.total}
                            limit={cmPagination.limit}
                            onPageChange={setCmPage}
                        />
                    )}
                    {activeTab !== 'Register Interest' && activeTab !== 'Missing Sports' && activeTab !== 'Contact Metadata' && (
                        <DemandPagination />
                    )}
                </div>

            </div>
        </div>
    );
};

export default DemandSignals;