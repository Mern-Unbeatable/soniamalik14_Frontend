import React, { useCallback, useEffect, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import TablePagination from '../../../../components/ui/TablePagination';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

const formatInquiryDate = (value) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
};

const mapInquiryToRow = (inquiry) => ({
  id: inquiry.id,
  playerName: inquiry?.sender?.name || '-',
  phoneNumber: inquiry?.sender?.phone || inquiry?.sender?.phoneNumber || '-',
  email: inquiry?.sender?.email || '-',
  eventListingName:
    inquiry?.event?.title ||
    inquiry?.service?.listingHeadline ||
    '-',
  message: inquiry?.message || '-',
  date: formatInquiryDate(inquiry?.createdAt),
  details: inquiry?.message || '-',
});

const Enquiries = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [enquiries, setEnquiries] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const fetchEnquiries = useCallback(async () => {
        try {
            setLoading(true);
            const response = await GET(ENDPOINT.INQUIRIES.LIST, {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            const data = response?.data?.data || {};
            const inquiriesList = Array.isArray(data?.inquiries) ? data.inquiries : [];
            const pagination = data?.pagination || {};

            setEnquiries(inquiriesList.map(mapInquiryToRow));
            setTotalResults(Number(pagination?.total) || inquiriesList.length);
            setTotalPages(Number(pagination?.totalPages) > 0 ? Number(pagination.totalPages) : 1);
        } catch (error) {
            console.error('Failed to fetch enquiries:', error);
            setEnquiries([]);
            setTotalResults(0);
            setTotalPages(1);
            toast.error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchEnquiries();
    }, [fetchEnquiries]);

    const safePage = Math.min(currentPage, totalPages);

    return (
        <div className="dashboardPy dashboardSpaceY bg-[#F4F6F8]">
            <section className="rounded-lg bg-white">
                <div className="px-5 pt-5 pb-4">
                    <h1 className="text-2xl text-btn-primary leading-9 font-semibold ">Enquaries</h1>
                </div>

                {loading && (
                    <p className="px-5 py-8 text-center text-sm text-[#4B5563]">Loading enquiries...</p>
                )}

                {!loading && enquiries.length === 0 && (
                    <p className="px-5 py-8 text-center text-sm text-[#4B5563]">No enquiries found.</p>
                )}

                {!loading && enquiries.length > 0 && (
                    <>
                        <div className="space-y-3 p-4 md:hidden">
                            {enquiries.map((enquiry, idx) => (
                                <div key={`${enquiry.id}-${idx}`} className="rounded-xl border border-[#E7F1F1] bg-[#E7F1F1] p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-semibold text-[#1D1D1D]">{enquiry.playerName}</h3>
                                            <p className="text-sm text-[#0F766E]">{enquiry.phoneNumber}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedApplicant(enquiry)}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D5E2E1] text-[#1D1D1D] hover:bg-[#EAF2F1]"
                                            aria-label={`Open enquiry details for ${enquiry.playerName}`}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-3 space-y-1.5 text-sm text-[#4B5563]">
                                        <p>
                                            <span className="font-semibold text-[#1D1D1D]">Event/Listing Name:</span> {enquiry.eventListingName}
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
                                    {enquiries.map((enquiry, idx) => (
                                        <tr key={`${enquiry.id}-${idx}`} className="border-b border-[#E7F1F1] last:border-b-0 align-middle">
                                            <td className="px-5 py-4 text-base font-medium text-[#2F3B3A]">{enquiry.playerName}</td>
                                            <td className="px-5 py-4 text-base text-[#4B5563]">{enquiry.phoneNumber}</td>
                                            <td className="px-5 py-4 text-base text-[#2F3B3A]">{enquiry.eventListingName}</td>
                                            <td className="max-w-90 px-5 py-4 text-base leading-6 text-[#4B5563]">{enquiry.message}</td>
                                            <td className="px-5 py-4 text-base text-[#4B5563]">{enquiry.date}</td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedApplicant(enquiry)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#1D1D1D]"
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
                            resultsPerPage={ITEMS_PER_PAGE}
                            onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
                            wrapperClass="px-5 py-4"
                            resultsTextClass="text-base text-[#0F766E]"
                            buttonClass="rounded-xl px-4 py-2 text-base"
                        />
                    </>
                )}
            </section>

            {selectedApplicant && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedApplicant(null)}>
                    <div className="w-full max-w-150 overflow-hidden rounded-2xl bg-[#F3F4F6] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 pt-6 pb-3">
                            <h2 className="text-xl leading-8 font-semibold text-[#1D1D1D]">Applicant Details</h2>
                            <button
                                type="button"
                                onClick={() => setSelectedApplicant(null)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D1D5DB] text-[#1D1D1D] hover:bg-[#C7CCD2]"
                                aria-label="Close enquiry modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="max-h-[75vh] overflow-y-auto px-5 pb-6">
                            <div className="space-y-2 text-base font-semibold leading-8 text-[#1D1D1D]">
                                <p className="font-semibold">{selectedApplicant.playerName}</p>
                                <p>{selectedApplicant.phoneNumber}</p>
                                <p className="break-all">{selectedApplicant.email}</p>
                                <p>Event Name: {selectedApplicant.eventListingName}</p>
                            </div>

                            <p className="pt-3 text-base leading-7 text-[#374151]">{selectedApplicant.details}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Enquiries;