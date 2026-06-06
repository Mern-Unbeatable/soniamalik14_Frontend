import React from 'react';
import { Eye } from 'lucide-react';

export default function ClubCard({ club, onView }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-1 text-base font-semibold text-gray-900">{club.name}</div>
      <div className="text-base text-gray-600">Owner: {club.owner}</div>
      <div className="text-base text-gray-600">Phone: {club.phone}</div>
      <div className="text-base text-gray-600">Location: {club.location}</div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onView}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          aria-label={`View ${club.name}`}
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
}
