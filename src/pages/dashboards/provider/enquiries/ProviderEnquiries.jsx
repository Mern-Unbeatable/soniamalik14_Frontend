import React, { useMemo, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import TablePagination from '../../../../components/ui/TablePagination';
import enquiriesData from '../../../../data/providerEnquiriesData.json';
import registerInterestData from '../../../../data/providerRegisterInterestData.json';

const EnquiryDetailsModal = ({ open, onClose, enquiry }) => {
  if (!open || !enquiry) return null;

  const applicantSummary =
    enquiry.applicantSummary ||
    `I am a passionate women athlete who loves playing sports and being part of a team. I enjoy improving my skills, staying active, and competing in a positive and supportive environment. I am especially interested in sports like cricket and football, and I am always ready to learn, train harder, and grow as a player. Being part of a women's sports community gives me confidence and motivation. I believe in teamwork, respect, and supporting other women so that we can all succeed together on and off the field. I am currently looking for opportunities to join a team, participate in matches, and work with experienced coaches who can help me reach the next level.`;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-150 overflow-hidden rounded-2xl bg-[#F3F4F6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-3">
          <h2 className="text-xl leading-8 font-semibold text-[#1D1D1D]">Applicant Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D1D5DB] text-[#1D1D1D] hover:bg-[#C7CCD2]"
            aria-label="Close enquiry modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-5 pb-6">
          <div className="space-y-2 text-base font-semibold leading-8 text-[#1D1D1D]">
          <p className="font-semibold">{enquiry.playerName}</p>
          <p>{enquiry.phone}</p>
          <p className="break-all">{enquiry.email}</p>
          <p>Event Name: {enquiry.eventTitle}</p>
          </div>

          <p className="pt-3 text-base leading-7 text-[#374151]">{applicantSummary}</p>

          <textarea
            rows={6}
            placeholder="write your reply"
            className="mt-4 w-full resize-none rounded-md border border-[#E5E7EB] bg-[#ECECEC] px-4 py-3 text-base text-[#1D1D1D] outline-none placeholder:text-[#8F949B] focus:border-[#0F766E]/50"
          />

          <button
            type="button"
            className="mt-4 inline-flex items-center rounded-md bg-[#0F766E] px-5 py-2.5 text-lg font-medium text-white hover:bg-[#0D6660]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const ProviderEnquiries = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [interestPage, setInterestPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const perPage = 6;
  const totalResults = enquiriesData.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const safePage = Math.min(currentPage, totalPages);

  const interestTotalResults = registerInterestData.length;
  const interestTotalPages = Math.max(1, Math.ceil(interestTotalResults / perPage));
  const safeInterestPage = Math.min(interestPage, interestTotalPages);

  const pageData = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return enquiriesData.slice(start, start + perPage);
  }, [safePage]);

  const interestPageData = useMemo(() => {
    const start = (safeInterestPage - 1) * perPage;
    return registerInterestData.slice(start, start + perPage);
  }, [safeInterestPage]);

  const openDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedEnquiry(null);
    setIsModalOpen(false);
  };

  return (
    <div className="dashboardPy dashboardSpaceY bg-[#F4F6F8]">
      <section className="rounded-lg bg-white">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl text-btn-primary leading-9 font-semibold ">Enquiries</h1>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {pageData.map((enquiry) => (
            <div key={enquiry.id} className="rounded-xl border border-[#E7F1F1] bg-[#E7F1F1] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[#1D1D1D]">{enquiry.playerName}</h3>
                  <p className="text-sm text-[#0F766E]">{enquiry.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openDetails(enquiry)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5E2E1] text-[#1D1D1D] hover:bg-[#EAF2F1]"
                  aria-label={`Open enquiry details for ${enquiry.playerName}`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 space-y-1.5 text-sm text-[#4B5563]">
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Event/Listing Name:</span> {enquiry.eventTitle}
                </p>
                <p className="break-all">
                  <span className="font-semibold text-[#1D1D1D]">Message:</span> {enquiry.message}
                </p>
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Date:</span> {enquiry.date}
                </p>
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Email:</span> {enquiry.email}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-245 border-collapse xl:min-w-full">
            <thead>
              <tr className="bg-[#E7F1F1] text-left border-b border-[#E7F1F1]">
                <th className="px-5 py-2 text-base font-medium text-[#1D1D1D]">Player Name</th>
                <th className="px-5 py-2 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Event/Listing Name</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Message</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Date</th>
                <th className="px-5 py-3 text-center text-base font-medium text-[#1D1D1D]">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-[#E7F1F1] last:border-b-0 align-middle">
                  <td className="px-5 py-4 text-base font-medium text-[#2F3B3A]">{enquiry.playerName}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{enquiry.phone}</td>
                  <td className="px-5 py-4 text-base text-[#2F3B3A]">{enquiry.eventTitle}</td>
                  <td className="max-w-90 px-5 py- text-base leading-6 text-[#4B5563]">{enquiry.message}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{enquiry.date}</td>
                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => openDetails(enquiry)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#1D1D1D] "
                      aria-label={`Open enquiry details for ${enquiry.playerName}`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={safePage}
          totalPages={totalPages}
          totalResults={totalResults}
          resultsPerPage={perPage}
          onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
          wrapperClass="px-5 py-4"
          resultsTextClass="text-base text-[#0F766E]"
          buttonClass="rounded-xl px-4 py-2 text-base"
        />
      </section>

      <EnquiryDetailsModal open={isModalOpen} onClose={closeDetails} enquiry={selectedEnquiry} />

      <section className="rounded-lg bg-white">
        <div className="px-5 pt-5 pb-4">
          <h2 className="text-2xl leading-9 font-semibold text-btn-primary">Register Interest</h2>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {interestPageData.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#E7F1F1] bg-[#E7F1F1] p-4">
              <h3 className="text-base font-semibold text-[#1D1D1D]">{item.name}</h3>
              <div className="mt-3 space-y-1.5 text-sm text-[#4B5563]">
                <p>
                  <span className="font-semibold text-[#1D1D1D]">Phone:</span> {item.phone}
                </p>
                <p className="break-all">
                  <span className="font-semibold text-[#1D1D1D]">Email:</span> {item.email}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-245 border-collapse xl:min-w-full">
            <thead>
              <tr className="bg-[#E7F1F1] text-left border-b border-[#E7F1F1]">
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Name</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                <th className="px-5 py-3 text-base font-medium text-[#1D1D1D]">Email</th>
              </tr>
            </thead>
            <tbody>
              {interestPageData.map((item) => (
                <tr key={item.id} className="border-b border-[#E7F1F1] last:border-b-0 align-middle">
                  <td className="px-5 py-4 text-base font-medium text-[#2F3B3A]">{item.name}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{item.phone}</td>
                  <td className="px-5 py-4 text-base text-[#4B5563]">{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={safeInterestPage}
          totalPages={interestTotalPages}
          totalResults={interestTotalResults}
          resultsPerPage={perPage}
          onPageChange={(p) => setInterestPage(Math.max(1, Math.min(interestTotalPages, p)))}
          wrapperClass="px-5 py-4"
          resultsTextClass="text-base text-[#0F766E]"
          buttonClass="rounded-xl px-4 py-2 text-base"
        />
      </section>
    </div>
  );
};

export default ProviderEnquiries;
