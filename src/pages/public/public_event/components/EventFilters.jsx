

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListFilter } from 'lucide-react';
import { fetchSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../../features/sportsCategories/sportsCategoriesSlice';

// Reusable wrapper for the filter sections
const FilterSection = ({ title, children, icon: Icon }) => (
  <div className="bg-white border border-[#CDE1DF] rounded-lg p-4 mb-4 shadow-sm">
    <div className="flex items-center justify-between mb-3.5">
      <h3 className="text-[15px] font-bold text-[#14322F]">{title}</h3>
      {Icon && <Icon className="w-[18px] h-[18px] text-[#14322F]" />}
    </div>
    {children}
  </div>
);

const EVENT_TYPE_OPTIONS = [
  { label: 'Match', value: 'MATCH' },
  { label: 'Tournament', value: 'TOURNAMENT' },
  { label: 'Trial', value: 'TRIAL' },
  { label: 'Training', value: 'TRAINING' },
  { label: 'Workshop', value: 'WORKSHOP' },
  { label: 'Seminar', value: 'SEMINAR' },
  { label: 'Competition', value: 'COMPETITION' },
  { label: 'Meetup', value: 'MEETUP' },
];

const SPORT_OPTIONS = [
  'Football',
  'Squash',
  'Rugby',
  'Netball',
  'Cricket',
  'Padel',
  'Tennis',
  'Badminton',
  'Golf',
  'Running',
  'Multi-Sport',
  'Not sport-specific',
];

const EventFilters = ({ filters = {}, onChange = () => { } }) => {
  const dispatch = useDispatch();
  const sportsCategories = useSelector(selectSportsCategories);

  useEffect(() => {
    dispatch(fetchSportsCategories());
  }, [dispatch]);

  const dynamicSports = useMemo(() => {
    if (!sportsCategories || sportsCategories.length === 0) {
      return SPORT_OPTIONS;
    }
    const names = sportsCategories.map(cat => cat.name).filter(Boolean);
    const filtered = names.filter(n => n !== 'Other');
    return [...filtered, 'Other'];
  }, [sportsCategories]);

  const update = (patch) => onChange({ ...filters, ...patch });

  // Generic toggler for checkbox arrays
  const toggleArrayFilter = (key, value) => {
    const currentList = filters[key] || [];
    const set = new Set(currentList);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    update({ [key]: Array.from(set) });
  };

  const toggleDateFilter = (value) => {
    const currentList = filters.date || [];
    update({ date: currentList.includes(value) ? [] : [value] });
  };

  const selectedSport = useMemo(() => {
    if (Array.isArray(filters.sport) && filters.sport.length > 0) {
      return filters.sport[0];
    }
    if (typeof filters.sport === 'string' && filters.sport) {
      return filters.sport;
    }
    return '';
  }, [filters.sport]);

  const selectClassName =
    'w-full bg-[#F8F9F9] border-none rounded-md px-3 py-2 text-base text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-[#147B6B] outline-none appearance-none cursor-pointer';

  return (
    <div className="w-full">
      {/* City/Area & Distance Filter */}
      <FilterSection title="Filters" icon={ListFilter}>
        <div className="space-y-3">
          <div>
            <label className="block text-base text-[#1A1D1F] mb-1.5">
              City/Area
            </label>
            <input
              value={filters.city || ''}
              onChange={(e) => update({ city: e.target.value })}
              placeholder="City, area or postcode"
              className="w-full bg-[#F8F9F9] border-none rounded-md px-3 py-2 text-base placeholder-gray-400 focus:ring-1 focus:ring-[#147B6B] outline-none"
            />
          </div>
          <div>
            <label className="block text-base text-[#1A1D1F] mb-1.5">
              Distance
            </label>
            <div className="relative">
              <select
                value={filters.distance || ''}
                onChange={(e) => update({ distance: e.target.value })}
                className={selectClassName}
              >
                <option value="">Any distance</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Event Type */}
      <FilterSection title="Event Type">
        <div className="space-y-3">
          {EVENT_TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.eventTypes || []).includes(option.value)}
                onChange={() => toggleArrayFilter('eventTypes', option.value)}
                className="w-[15px] h-[15px] rounded-sm border-gray-400 text-[#147B6B] focus:ring-[#147B6B] cursor-pointer"
              />
              <span className="text-[13px] text-[#1A1D1F] leading-none mt-0.5 group-hover:text-[#147B6B] transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Date */}
      <FilterSection title="Date">
        <div className="space-y-3">
          {['Upcoming', 'This Week', 'This Month'].map((d) => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.date || []).includes(d)}
                onChange={() => toggleDateFilter(d)}
                className="w-[15px] h-[15px] rounded-sm border-gray-400 text-[#147B6B] focus:ring-[#147B6B] cursor-pointer"
              />
              <span className="text-[13px] text-[#1A1D1F] leading-none mt-0.5 group-hover:text-[#147B6B] transition-colors">{d}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sport */}
      <FilterSection title="Sport">
        <div>
          <label className="block text-base text-[#1A1D1F] mb-1.5">Sport or activity</label>
          <div className="relative">
            <select
              value={selectedSport}
              onChange={(e) => {
                const value = e.target.value;
                update({ sport: value ? [value] : [] });
              }}
              className={selectClassName}
            >
              <option value="">Sports</option>
              {dynamicSports.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default EventFilters;