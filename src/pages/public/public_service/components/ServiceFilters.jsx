import React from 'react';
import Button from '../../../../components/ui/Button';

const ServiceFilters = ({ onFilter, active = 'All' }) => {
  const types = ['All', 'Physios', 'Nutrition', 'Mental Health', 'Wellbeing'];

  return (
    <div className="w-full xl:w-3/4 bg-secondary p-4 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1 bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-200">
          <input
            placeholder="Enter Postcode/City"
            className="w-full bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="md:hidden">
          <select
            value={active}
            onChange={(e) => onFilter && onFilter(e.target.value)}
            className="w-full bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-200 outline-none text-base text-gray-700"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex gap-2">
          {types.map((t) => (
            <Button
              key={t}
              variant={t === active ? 'primary' : 'outline'}
              className={`rounded-lg px-5 py-2 text-base ${t === active ? 'shadow-md' : ''}`}
              onClick={() => onFilter && onFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFilters;
