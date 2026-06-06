import { useState } from "react";


export default function BookingsTable({ data }) {
  const safeData = Array.isArray(data) ? data : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(safeData.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeData.slice(indexOfFirstItem, indexOfLastItem);
 
  return (
    <div
      className="w-full bg-white rounded-xl border border-gray-200 shadow-md font-sans overflow-hidden"
    >
      {/* Title */}
      <div className="pt-6 px-6 pb-4">
        <h2 className="m-0 text-2xl font-semibold text-gray-900">Bookings</h2>
      </div>

      {/* Table for desktop, hidden on mobile */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F8F8]">
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 border-t border-b border-gray-200">Name</th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 border-t border-b border-gray-200">Phone Number</th>
              <th className="px-6 py-3 text-left text-base font-medium text-gray-500 border-t border-b border-gray-200">Email</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((b, i) => (
                <tr key={b?.id || i} className="border-b border-gray-200">
                  <td className="px-6 py-5 text-base text-gray-900 font-normal">{b.name}</td>
                  <td className="px-6 py-5 text-base text-gray-700">{b.phone}</td>
                  <td className="px-6 py-5 text-base text-gray-700 wrap-break-word">{b.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-base text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile, hidden on desktop */}
      <div className="block md:hidden px-4 pb-2">
        {currentItems.length > 0 ? (
          currentItems.map((b, i) => (
            <div
              key={b?.id || i}
              className="border border-gray-200 rounded-lg mb-4 bg-gray-50 shadow-sm p-4"
            >
              <div className="font-semibold text-teal-600 text-[16px] mb-2">{b.name}</div>
              <div className="text-base text-gray-700 mb-1">
                <span className="font-medium">Phone:</span> {b.phone}
              </div>
              <div className="text-base text-gray-700">
                <span className="font-medium">Email:</span> {b.email}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-base text-gray-500">No bookings found.</div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 px-4 md:px-6 pb-4 md:pb-8 pt-4"
      >
        <span
          className="text-base text-teal-700 font-medium text-center md:text-left"
        >
          Showing {safeData.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, safeData.length)} of {safeData.length} results
        </span>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-base font-medium rounded-lg border transition-colors duration-150 ${
              currentPage === 1
                ? 'text-gray-400 border-gray-300 bg-white cursor-default'
                : 'text-teal-700 border-teal-600 bg-white hover:bg-teal-50 cursor-pointer'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 ${
              currentPage === totalPages
                ? 'text-gray-400 border-gray-300 bg-white cursor-default'
                : 'text-teal-700 border-teal-600 bg-white hover:bg-teal-50 cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
 

