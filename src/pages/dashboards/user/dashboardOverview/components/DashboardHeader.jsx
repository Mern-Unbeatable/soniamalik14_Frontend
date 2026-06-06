import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const DashboardHeader = ({ userName = "Ismail" }) => {
  const [stage, setStage] = useState('Exploring');

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between mb-10">
      <h1 className="text-4xl font-bold text-[#111827]">Hi {userName}</h1>
      
      <div className="flex flex-col mt-4 md:mt-0">
        <label className="text-sm text-gray-600 font-medium mb-1">What stage are you at?</label>
        <div className="relative w-48 max-w-full">
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 w-full"
          >
            <option value="Exploring">Exploring</option>
            <option value="Active">Active</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
