import React, { useState, useMemo } from 'react';
import DemandHeader from './components/DemandHeader';
import DemandTabs from './components/DemandTabs';
import DemandFilters from './components/DemandFilters';
import DemandAccountPreferencesTable from './components/DemandAccountPreferencesTable';
import DemandRegisterInterestTable from './components/DemandRegisterInterestTable';
import DemandMissingSportsTable from './components/DemandMissingSportsTable';
import DemandContactMetadataTable from './components/DemandContactMetadataTable';
import DemandPagination from './components/DemandPagination';

const DemandSignals = () => {
    // State for Tabs and Filters
    const [activeTab, setActiveTab] = useState('Account Preferences');
    const [riSearchQuery, setRiSearchQuery] = useState('');
    const [riFilter, setRiFilter] = useState('All');

    const tabs = ['Account Preferences', 'Register Interest', 'Missing Sports', 'Contact Metadata'];

    // --- DUMMY DATA ---
    const accountPreferencesData = [
        { id: 1, userId: 'USR-1000', sport: 'Tennis', postcode: 'SW1A 1AA', dateJoined: '03/03/2025' },
        { id: 2, userId: 'USR-1001', sport: 'Football', postcode: 'EC1A 1BB', dateJoined: '03/03/2025' },
        { id: 3, userId: 'USR-1002', sport: 'Badminton', postcode: 'M1 1AE', dateJoined: '03/03/2025' },
        { id: 4, userId: 'USR-1003', sport: 'Cricket', postcode: 'B1 1AA', dateJoined: '03/03/2025' },
        { id: 5, userId: 'USR-1004', sport: 'Football', postcode: 'LS1 1UR', dateJoined: '03/03/2025' },
        { id: 6, userId: 'USR-1005', sport: 'Padel', postcode: 'G1 1AA', dateJoined: '03/03/2025' },
    ];

    const registerInterestData = [
        { id: 1, user: 'USR-1000', listing: 'Premium Tennis Court', sport: 'Tennis', location: 'E1 6AN', date: '03/03/2025', responseTime: '5h', provider: 'Provider A', status: 'Pending' },
        { id: 2, user: 'USR-1000', listing: 'Premium Tennis Court', sport: 'Tennis', location: 'E1 6AN', date: '03/03/2025', responseTime: '5h', provider: 'Provider A', status: 'Contacted' },
        { id: 3, user: 'USR-1000', listing: 'Premium Tennis Court', sport: 'Tennis', location: 'E1 6AN', date: '03/03/2025', responseTime: '5h', provider: 'Provider A', status: 'Contacted' },
        { id: 4, user: 'USR-1000', listing: 'Premium Tennis Court', sport: 'Tennis', location: 'E1 6AN', date: '03/03/2025', responseTime: '5h', provider: 'Provider A', status: 'Pending' },
        { id: 5, user: 'USR-1000', listing: 'Premium Tennis Court', sport: 'Tennis', location: 'E1 6AN', date: '03/03/2025', responseTime: '5h', provider: 'Provider A', status: 'Contacted' },
        { id: 6, user: 'USR-1000', listing: 'Premium Tennis Court', sport: 'Tennis', location: 'E1 6AN', date: '03/03/2025', responseTime: '5h', provider: 'Provider A', status: 'Contacted' },
    ];

    const missingSportsData = [
        { id: 1, userId: 'USR-1000', requestedSport: 'Badminton', postcode: 'SW1A', radius: '10 MILE RADIUS', date: '03/03/2025', notes: 'Looking for local facilities.' },
        { id: 2, userId: 'USR-1000', requestedSport: 'Cricket', postcode: 'SW1A', radius: '10 MILE RADIUS', date: '03/03/2025', notes: 'Looking for local facilities.' },
        { id: 3, userId: 'USR-1000', requestedSport: 'Cricket', postcode: 'SW1A', radius: '10 MILE RADIUS', date: '03/03/2025', notes: 'Looking for local facilities.' },
        { id: 4, userId: 'USR-1000', requestedSport: 'Badminton', postcode: 'SW1A', radius: '10 MILE RADIUS', date: '03/03/2025', notes: 'Looking for local facilities.' },
        { id: 5, userId: 'USR-1000', requestedSport: 'Badminton', postcode: 'SW1A', radius: '10 MILE RADIUS', date: '03/03/2025', notes: 'Looking for local facilities.' },
        { id: 6, userId: 'USR-1000', requestedSport: 'Badminton', postcode: 'SW1A', radius: '10 MILE RADIUS', date: '03/03/2025', notes: 'Looking for local facilities.' },
    ];

    const contactMetadataData = [
        { id: 1, listing: 'Active Football Hub', provider: 'Provider J', received: 231, replies: 80, avgResponse: '39m', unanswered: 100, flagged: 3 },
        { id: 2, listing: 'Active Football Hub', provider: 'Provider J', received: 231, replies: 80, avgResponse: '1h 26m', unanswered: 100, flagged: 3 },
        { id: 3, listing: 'Active Football Hub', provider: 'Provider J', received: 231, replies: 80, avgResponse: '1h 26m', unanswered: 100, flagged: 3 },
        { id: 4, listing: 'Active Football Hub', provider: 'Provider J', received: 231, replies: 80, avgResponse: '1h 26m', unanswered: 100, flagged: 3 },
        { id: 5, listing: 'Active Football Hub', provider: 'Provider J', received: 231, replies: 80, avgResponse: '1h 26m', unanswered: 100, flagged: 3 },
        { id: 6, listing: 'Active Football Hub', provider: 'Provider J', received: 231, replies: 80, avgResponse: '1h 26m', unanswered: 100, flagged: 3 },
    ];

    // --- FILTER LOGIC FOR 'REGISTER INTEREST' TAB ---
    const filteredRegisterInterest = useMemo(() => {
        return registerInterestData.filter(item => {
            const matchesSearch = item.user.toLowerCase().includes(riSearchQuery.toLowerCase()) ||
                item.listing.toLowerCase().includes(riSearchQuery.toLowerCase()) ||
                item.provider.toLowerCase().includes(riSearchQuery.toLowerCase());

            const matchesStatus = riFilter === 'All' ||
                (riFilter === 'Contacted' && item.status === 'Contacted') ||
                (riFilter === 'Not Contacted' && item.status === 'Pending');

            return matchesSearch && matchesStatus;
        });
    }, [riSearchQuery, riFilter]);

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
                        {activeTab === 'Account Preferences' && <DemandAccountPreferencesTable data={accountPreferencesData} />}
                        {activeTab === 'Register Interest' && <DemandRegisterInterestTable data={filteredRegisterInterest} />}
                        {activeTab === 'Missing Sports' && <DemandMissingSportsTable data={missingSportsData} />}
                        {activeTab === 'Contact Metadata' && <DemandContactMetadataTable data={contactMetadataData} />}
                    </div>

                    {/* Pagination */}
                    <DemandPagination />
                </div>

            </div>
        </div>
    );
};

export default DemandSignals;