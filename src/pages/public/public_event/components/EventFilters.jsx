

import React from 'react';
import { ListFilter } from 'lucide-react';

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

const EventFilters = ({ filters = {}, onChange = () => { } }) => {
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

  return (
    <div className="w-full">
      {/* City/Area Filter */}
      <FilterSection title="Filters" icon={ListFilter}>
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
      </FilterSection>

      {/* Event Type */}
      <FilterSection title="Event Type">
        <div className="space-y-3">
          {[
            'All events',
            'Workshops & learning',
            'Wellbeing & support',
            'Tournaments & competitions',
            'Community & campaigns',
          ].map((t) => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.eventTypes || []).includes(t)}
                onChange={() => toggleArrayFilter('eventTypes', t)}
                className="w-[15px] h-[15px] rounded-sm border-gray-400 text-[#147B6B] focus:ring-[#147B6B] cursor-pointer"
              />
              <span className="text-[13px] text-[#1A1D1F] leading-none mt-0.5 group-hover:text-[#147B6B] transition-colors">{t}</span>
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
                onChange={() => toggleArrayFilter('date', d)}
                className="w-[15px] h-[15px] rounded-sm border-gray-400 text-[#147B6B] focus:ring-[#147B6B] cursor-pointer"
              />
              <span className="text-[13px] text-[#1A1D1F] leading-none mt-0.5 group-hover:text-[#147B6B] transition-colors">{d}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sport (Converted to Checkboxes as per image) */}
      <FilterSection title="Sport">
        <div className="space-y-3">
          {[
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
          ].map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                // Checking if it's in an array since we converted this from a single string select
                checked={Array.isArray(filters.sport) ? filters.sport.includes(s) : filters.sport === s}
                onChange={() => toggleArrayFilter('sport', s)}
                className="w-[15px] h-[15px] rounded-sm border-gray-400 text-[#147B6B] focus:ring-[#147B6B] cursor-pointer"
              />
              <span className="text-[13px] text-[#1A1D1F] leading-none mt-0.5 group-hover:text-[#147B6B] transition-colors">{s}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default EventFilters;