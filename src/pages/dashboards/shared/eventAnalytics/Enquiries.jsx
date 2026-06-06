import React, { useMemo, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import TablePagination from '../../../../components/ui/TablePagination';
import eventAnalyticsDetailsData from '../../../../data/eventAnalyticsDetailsData.json';

const Enquiries = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [interestPage, setInterestPage] = useState(1);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const perPage = 6;

    const enquiriesRows = useMemo(
        () =>
            (eventAnalyticsDetailsData.enquiries || []).map((row) => ({
                playerName: row.playerName,
                phoneNumber: row.phoneNumber,
                eventListingName: row.eventListingName || 'U16 Goalkeeper Wanted',
                message: row.message,
                date: row.date,
                email: row.email,
                details: row.details || row.message,
            })),
        []
    );

    const registerInterestRows = useMemo(
        () =>
            (eventAnalyticsDetailsData.registerInterest || []).map((row) => ({
                name: row.name,
                phoneNumber: row.phoneNumber,
                email: row.email,
            })),
        []
    );

    const totalResults = enquiriesRows.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
    const safePage = Math.min(currentPage, totalPages);

    const interestTotalResults = registerInterestRows.length;
    const interestTotalPages = Math.max(1, Math.ceil(interestTotalResults / perPage));
    const safeInterestPage = Math.min(interestPage, interestTotalPages);

    const pageData = useMemo(() => {
        const start = (safePage - 1) * perPage;
        return enquiriesRows.slice(start, start + perPage);
    }, [enquiriesRows, safePage]);

    const interestPageData = useMemo(() => {
        const start = (safeInterestPage - 1) * perPage;
        return registerInterestRows.slice(start, start + perPage);
    }, [registerInterestRows, safeInterestPage]);

    return (
        <div className="dashboardPy dashboardSpaceY bg-[#F4F6F8]">
            <section className="rounded-lg bg-white">
                <div className="px-5 pt-5 pb-4">
                    <h1 className="text-2xl text-btn-primary leading-9 font-semibold ">Enquaries</h1>
                </div>

                <div className="space-y-3 p-4 md:hidden">
                    {pageData.map((enquiry, idx) => (
                        <div key={`${enquiry.playerName}-${idx}`} className="rounded-xl border border-[#E7F1F1] bg-[#E7F1F1] p-4">
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
                            {pageData.map((enquiry, idx) => (
                                <tr key={`${enquiry.playerName}-${idx}`} className="border-b border-[#E7F1F1] last:border-b-0 align-middle">
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
                    resultsPerPage={perPage}
                    onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
                    wrapperClass="px-5 py-4"
                    resultsTextClass="text-base text-[#0F766E]"
                    buttonClass="rounded-xl px-4 py-2 text-base"
                />
            </section>

            <section className="rounded-lg bg-white">
                <div className="px-5 pt-5 pb-4">
                    <h2 className="text-2xl leading-9 font-semibold text-btn-primary">Register Interest</h2>
                </div>

                <div className="space-y-3 p-4 md:hidden">
                    {interestPageData.map((item, idx) => (
                        <div key={`${item.email}-${idx}`} className="rounded-xl border border-[#E7F1F1] bg-[#E7F1F1] p-4">
                            <h3 className="text-base font-semibold text-[#1D1D1D]">{item.name}</h3>
                            <div className="mt-3 space-y-1.5 text-sm text-[#4B5563]">
                                <p>
                                    <span className="font-semibold text-[#1D1D1D]">Phone:</span> {item.phoneNumber}
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
                            {interestPageData.map((item, idx) => (
                                <tr key={`${item.email}-${idx}`} className="border-b border-[#E7F1F1] last:border-b-0 align-middle">
                                    <td className="px-5 py-4 text-base font-medium text-[#2F3B3A]">{item.name}</td>
                                    <td className="px-5 py-4 text-base text-[#4B5563]">{item.phoneNumber}</td>
                                    <td className="px-5 py-4 text-base text-[#4B5563] break-all">{item.email}</td>
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