import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/ui/PageHeader';
import DiscoverCard from './components/DiscoverCard';
import Pagination from './components/Pagination';
import DiscoverEmptyPage from './components/DiscoverEmptyPage';
import { GET } from '../../../services/httpMethods';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { fetchSportsCategories } from '../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../features/sportsCategories/sportsCategoriesSlice';

const DISCOVER_API = '/api/services/by-role';

const toDiscoverItem = (service) => {
  const sports = Array.isArray(service?.sports) ? service.sports.filter(Boolean) : [];
  const sessionTypes = Array.isArray(service?.sessionTypes)
    ? service.sessionTypes.filter(Boolean)
    : [];
  const suitableFor = Array.isArray(service?.suitableFor) ? service.suitableFor.filter(Boolean) : [];
  const availableDays = Array.isArray(service?.availableDays)
    ? service.availableDays.filter(Boolean)
    : [];

  return {
    id: service?.id,
    title: service?.listingHeadline || service?.organizationName || service?.providerName || 'Untitled service',
    titleColor: '#0B544E',
    type: sessionTypes[0] || 'Training',
    sport: sports[0] || 'Others',
    day: service?.sessonDay || availableDays.join(', ') || 'Schedule not specified',
    time: service?.timeSlote || 'Time not specified',
    location: service?.clinicName || service?.location || service?.city || 'Location not specified',
    summary: 'Login to see contact details & ability requirements',
    image: service?.logo || service?.provider?.avatar || '',
    about: service?.description || service?.aboutService || '',
    homeGround: service?.clinicName || service?.location || '',
    level: suitableFor.join(', ') || 'All levels',
    ageGroup: 'Not specified',
    experienceRequired: suitableFor.join(', ') || 'Not specified',
    trainingFrequency: availableDays.length ? `${availableDays.length} days per week` : 'Not specified',
    matchSchedule: 'Not specified',
    seasonDuration: 'Not specified',
    headCoach: service?.contactName || service?.providerName || service?.provider?.name || 'Not specified',
    coachingStyle: 'Not specified',
    trialRequired: 'Not specified',
    trialDate: 'Not specified',
    trialTime: 'Not specified',
    trialLocation: service?.clinicName || 'Not specified',
    postedBy: service?.providerName || service?.organizationName || 'Not specified',
    contactEmail: service?.providerEmail || '',
    phone: service?.providerPhone || '',
    coach: service?.providerName || service?.provider?.name || service?.contactName || 'Not specified',
    suitableFor: suitableFor.join(', ') || 'Not specified',
    womensOnly: service?.womenOnly ? 'Yes' : 'No',
    town: service?.city || '',
    postcode: service?.postcode || '',
    mapImage: service?.googleMapLink || '',
    bookingLink: service?.bookingLink || '',
  };
};

const DiscoverView = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const sportParam = searchParams.get('sport') || '';

  const [services, setServices] = useState([]);
  const categories = useSelector(selectSportsCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSport, setSelectedSport] = useState(sportParam);
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setSelectedSport(sportParam);
  }, [sportParam]);

  useEffect(() => {
    dispatch(fetchSportsCategories());
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDiscoverServices = async () => {
      try {
        setLoading(true);
        setError('');

        const url = location ? '/api/services' : DISCOVER_API;
        const params = location
          ? { postcode: location }
          : { status: 'ACTIVE', providerRole: 'COACH' };

        const response = await GET(
          url,
          params,
          controller.signal,
          { skipAuth: true, withCredentials: false }
        );

        const serviceList = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setServices(serviceList.map(toDiscoverItem));
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load discover listings.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchDiscoverServices();
    }, location ? 500 : 0);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [location]);

  // Filter the data based on selected filters
  const filtered = useMemo(
    () =>
      services.filter((item) => {
        let match = true;

        if (selectedSport) {
          match = match && item.sport.toLowerCase() === selectedSport.toLowerCase();
        }

        if (location) {
          const search = location.toLowerCase();
          match =
            match &&
            (item.location?.toLowerCase().includes(search) ||
              item.homeGround?.toLowerCase().includes(search) ||
              item.town?.toLowerCase().includes(search) ||
              item.postcode?.toLowerCase().includes(search));
        }

        if (distance) {
          match = match && true;
        }

        return match;
      }),
    [services, selectedSport, location, distance]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  return (
    <section className="bg-[#F8FAFC] py-6 lg:py-10">
      <Container>
        <div className="mb-8">
          <PageHeader
            title="Find your sport"
            description="Discover women's sports sessions and teams near you, with options to suit different levels and interests."
          />

          {/* New Filter Section Added Here */}

          <div className="mt-4 inline-flex w-full flex-col gap-3 rounded-lg bg-[#E7F1F1] p-4 sm:w-auto sm:flex-row">
            {/* Postcode/City Input */}
            <input
              type="text"
              placeholder="Enter Postcode/City"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border-none bg-white px-3 py-2 text-base text-gray-700 placeholder-gray-400 shadow-sm outline-none focus:ring-1 focus:ring-teal-500 sm:w-55"
            />
            {/* Select Sports Dropdown */}
            <div className="relative w-full sm:w-45">
              <select
                value={selectedSport}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedSport(val);
                  setPage(1);
                  if (val) {
                    setSearchParams({ sport: val });
                  } else {
                    setSearchParams({});
                  }
                }}
                className="w-full cursor-pointer appearance-none rounded-md border-none bg-white px-3 py-3 text-base text-gray-700 shadow-sm outline-none focus:ring-1 focus:ring-teal-500"
              >
                
                {categories.map((cat, index) => {
                  const name = typeof cat === 'object' ? cat?.name : cat;
                  return (
                    <option key={cat?.id || index} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-800">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {/* Distance Dropdown */}
            <div className="relative w-full sm:w-40">
              <select
                value={distance}
                onChange={(e) => {
                  setDistance(e.target.value);
                  setPage(1);
                }}
                className="w-full cursor-pointer appearance-none rounded-md border-none bg-white px-3 py-3 text-base text-gray-700 shadow-sm outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">Any distance</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-800">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Discover listings are loading..." />
        ) : error ? (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((item) => (
                <DiscoverCard key={item.id} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} total={totalPages} onChange={(p) => setPage(p)} />
            )}
          </>
        ) : (
          <DiscoverEmptyPage />
        )}
      </Container>
    </section>
  );
};

export default DiscoverView;
