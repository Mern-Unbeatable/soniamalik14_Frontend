import React, { useState, useMemo } from 'react';
import { Cross, Eye, X } from 'lucide-react';
import Table from '../../../../../components/ui/Table';
import TablePagination from '../../../../../components/ui/TablePagination';

const ApplicationTable = ({ applicants = [], resultsPerPage = 9 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalResults = applicants.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return applicants.slice(start, start + resultsPerPage);
  }, [applicants, currentPage, resultsPerPage]);

  const columns = ['Player Name', 'Phone Number', 'Email', 'Date', 'Position', 'Action'];

  const sampleApplicants = [
    { id: 's1', name: 'Eleanor Pena', phone: '(219) 555-0114', email: 'kenzi.lawson@example.com', date: '15 Jan 2026', position: 'Midfielder' },
    { id: 's2', name: 'Wade Warren', phone: '(208) 555-0112', email: 'alma.lawson@example.com', date: '15 Jan 2026', position: 'Midfielder' },
    { id: 's3', name: 'Alex Morgan', phone: '(219) 555-0144', email: 'alex.morgan@example.com', date: '16 Jan 2026', position: 'Forward' },
    { id: 's4', name: 'Jordan Smith', phone: '(310) 555-0199', email: 'jordan.smith@example.com', date: '17 Jan 2026', position: 'Defender' },
    { id: 's5', name: 'Casey Lee', phone: '(415) 555-0133', email: 'casey.lee@example.com', date: '18 Jan 2026', position: 'Goalkeeper' }
  ];

  const effectiveApplicants = (applicants && applicants.length > 0) ? applicants : sampleApplicants;

  const renderRow = (a) => (
    <>
      <td className="px-4 py-4">{a.name}</td>
      <td className="px-4 py-4 text-gray-600">{a.phone}</td>
      <td className="px-4 py-4 text-gray-600">{a.email}</td>
      <td className="px-4 py-4 text-gray-600">{a.date}</td>
      <td className="px-4 py-4 text-gray-600">{a.position}</td>
      <td className="px-4 py-4">
        <button
          type="button"
          title="View applicant"
          className="p-2 rounded-md text-gray-600 hover:text-gray-900"
          onClick={() => { setSelectedApplicant(a); setModalOpen(true); }}
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </>
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  return (
    <div>
      <Table columns={columns} data={paginated.length ? paginated : effectiveApplicants.slice(0, resultsPerPage)} renderRow={renderRow} />

      <div className="">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* Applicant Details Modal */}
      {modalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-xl mx-4 p-6 shadow-lg">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-[#D9D9D9] p-2 hover:bg-gray-200"
            >
              <X className="w-4 h-4 text-black" />
            </button>

            <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>

            <div className="space-y-2">
              <div className="font-medium">{selectedApplicant.name}</div>
              <div className="text-base text-gray-600">{selectedApplicant.phone}</div>
              <div className="text-base text-gray-600">{selectedApplicant.email}</div>
              <div className="text-base text-gray-600">{selectedApplicant.position || 'â€”'}</div>
            </div>

            <div className="mt-4 text-base text-gray-700">
              {selectedApplicant.description || selectedApplicant.bio || selectedApplicant.coverLetter || (
                <p>
                  I am a passionate women athlete who loves playing sports and being part of a team. I enjoy improving my skills, staying active, and competing in a positive and supportive environment.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTable;
