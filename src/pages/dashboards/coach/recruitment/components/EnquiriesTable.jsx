import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ApplicantModal from './ApplicantModal';

const EnquiriesTable = ({ data }) => {
  const safeData = Array.isArray(data) ? data : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(safeData.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeData.slice(indexOfFirstItem, indexOfLastItem);
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white font-sans shadow-md">
      {/* Title */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="m-0 text-2xl font-semibold text-gray-900">Enquiries</h2>
      </div>

      {/* Table for desktop, hidden on mobile */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#E7F1F1]">
              <th className="border-t border-b border-gray-200 px-6 py-3 text-left text-base font-medium text-gray-500">
                Player Name
              </th>
              <th className="border-t border-b border-gray-200 px-6 py-3 text-left text-base font-medium text-gray-500">
                Phone Number
              </th>
              <th className="border-t border-b border-gray-200 px-6 py-3 text-left text-base font-medium text-gray-500">
                Email
              </th>
              <th className="border-t border-b border-gray-200 px-6 py-3 text-left text-base font-medium text-gray-500">
                Message
              </th>
              <th className="border-t border-b border-gray-200 px-6 py-3 text-left text-base font-medium text-gray-500">
                Date
              </th>
              <th className="border-t border-b border-gray-200 px-6 py-3  text-base text-center font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((e, i) => (
                <tr key={e?.id || i} className="border-b border-gray-200 hover:bg-gray-50/50">
                  <td className="px-6 py-5 text-base font-medium whitespace-nowrap text-gray-900">
                    {e.name}
                  </td>
                  <td className="px-6 py-5 text-base whitespace-nowrap text-gray-700">{e.phone}</td>
                  <td className="max-w-37.5 px-6 py-5 text-base wrap-break-word text-gray-700">
                    {e.email}
                  </td>
                  <td className="max-w-62.5 px-6 py-5 text-base leading-relaxed text-gray-500">
                    {e.msg}
                  </td>
                  <td className="px-6 py-5 text-base whitespace-nowrap text-gray-700">{e.date}</td>
                  <td className="px-6 py-5 text-base text-gray-700 flex justify-center">
                    <button
                      className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100"
                      onClick={() => setSelected(e)}
                      aria-label="View Details"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-base text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile, hidden on desktop */}
      <div className="block px-4 pb-2 md:hidden">
        {currentItems.length > 0 ? (
          currentItems.map((e, i) => (
            <div key={e?.id || i} className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <div className="mb-2 text-[16px] font-semibold text-teal-600">{e.name}</div>
              <div className="mb-1 text-base text-gray-700">
                <span className="font-medium">Phone:</span> {e.phone}
              </div>
              <div className="mb-1 text-base text-gray-700">
                <span className="font-medium">Email:</span> {e.email}
              </div>
              <div className="mb-1 text-base text-gray-500">
                <span className="font-medium">Message:</span> {e.msg}
              </div>
              <div className="mb-2 text-base text-gray-700">
                <span className="font-medium">Date:</span> {e.date}
              </div>
              <div className="flex justify-end">
                <button
                  className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100"
                  onClick={() => setSelected(e)}
                  aria-label="View Details"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-base text-gray-500">No enquiries found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-4 md:flex-row md:items-center md:justify-between md:gap-0 md:px-6 md:pb-8">
        <span className="text-center text-base font-medium text-teal-700 md:text-left">
          Showing {safeData.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, safeData.length)} of{' '}
          {safeData.length} results
        </span>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`rounded-lg border px-4 py-2 text-base font-medium transition-colors duration-150 ${
              currentPage === 1
                ? 'cursor-default border-gray-300 bg-white text-gray-400'
                : 'cursor-pointer border-teal-600 bg-white text-teal-700 hover:bg-teal-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              currentPage === totalPages
                ? 'cursor-default border-gray-300 bg-white text-gray-400'
                : 'cursor-pointer border-teal-600 bg-white text-teal-700 hover:bg-teal-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      {/* Modal for applicant details */}
      <ApplicantModal enquiry={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default EnquiriesTable;
