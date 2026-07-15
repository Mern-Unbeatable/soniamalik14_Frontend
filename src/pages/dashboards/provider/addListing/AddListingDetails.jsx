import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  CalendarDays,
  Trophy,
  FileBadge2,
  ShieldCheck,
  ChevronRight,
  Globe,
  Copy,
  Check,
} from 'lucide-react';
import TablePagination from '../../../../components/ui/TablePagination';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import ApplicantModal from '../../coach/recruitment/components/ApplicantModal';

const ServiceOverviewItem = ({ icon, label, value }) => (
  <div className="rounded-xl border border-[#DEE6E8] bg-[#F3F5F8] p-4">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F1F1] text-[#0F766E]">{icon}</div>
      <div className="min-w-0">
        <p className="text-base font-semibold tracking-[0.01em] text-[#1D1D1D]">{label}</p>
        <p className="mt-1 whitespace-pre-line text-sm leading-7 text-[#374151]">{value}</p>
      </div>
    </div>
  </div>
);

const mapServiceToViewModel = (service) => {
  const sports = Array.isArray(service?.sports) ? service.sports : [];
  const sessionTypes = Array.isArray(service?.sessionTypes) ? service.sessionTypes : [];

  return {
    id: service?.id,
    providerName: service?.providerName || service?.provider?.name || 'Provider',
    organizer: service?.contactName || service?.provider?.name || service?.providerName || 'N/A',
    category:
      service?.role ||
      (Array.isArray(service?.providerType) ? service.providerType.join(', ') : service?.providerType) ||
      'N/A',
    about: service?.aboutService || service?.description || 'No service details available.',
    overview: {
      clinicName: service?.clinicName || 'N/A',
      addressLine1: service?.addressLine1 || '',
      townCity: service?.city || '',
      postcode: service?.postcode || '',
      primaryProfession:
        service?.role ||
        (Array.isArray(service?.providerType) ? service.providerType.join(', ') : service?.providerType) ||
        'N/A',
      sessionType: sessionTypes.length > 0 ? sessionTypes.join(', ') : 'N/A',
      sport: sports.length > 0 ? sports.join(', ') : 'N/A',
      professionalRegistration: service?.professionalRegistration || 'N/A',
      insuranceInPlace:
        typeof service?.insuranceInPlace === 'boolean'
          ? service.insuranceInPlace
            ? 'Yes'
            : 'No'
          : service?.insuranceInPlace || 'N/A',
    },
    bookingLink: service?.bookingLink || '',
    status: service?.status || '',
    bookings: Array.isArray(service?.bookings) ? service.bookings : [],
    enquiries: Array.isArray(service?.messages) ? service.messages : [],
  };
};

const AddListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [item, setItem] = useState(state?.item || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleOpenEnquiryModal = (rawEnquiry) => {
    setSelectedEnquiry({
      ...rawEnquiry,
      name: rawEnquiry.sender?.name || rawEnquiry.playerName || rawEnquiry.fullName || '—',
      phone: rawEnquiry.sender?.phone?.trim() || rawEnquiry.phone || '—',
      email: rawEnquiry.sender?.email || rawEnquiry.email || '—',
      msg: rawEnquiry.message || rawEnquiry.msg || '—',
      date: rawEnquiry.createdAt ? new Date(rawEnquiry.createdAt).toLocaleDateString('en-GB') : rawEnquiry.date || '—',
      senderId: rawEnquiry.senderId || rawEnquiry.sender?.id || rawEnquiry.userId || rawEnquiry.user?.id || rawEnquiry.sender?.Id
    });
  };

  const handleCopy = () => {
    if (item?.bookingLink) {
      navigator.clipboard.writeText(item.bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    let active = true;

    const loadServiceDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await GET(ENDPOINT.SERVICES.DETAIL(id));
        const payload = response?.data || response;
        const service = payload?.data?.service || payload?.service || payload?.data || null;

        if (!active) return;

        if (!service?.id) {
          setItem(null);
          setError('Service not found.');
          return;
        }

        setItem(mapServiceToViewModel(service));
      } catch (err) {
        if (!active) return;
        const message = err?.response?.data?.message || err?.message || 'Failed to load service details';
        setError(message);
        setItem(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (!id) {
      setError('Invalid service id.');
      setItem(null);
      setLoading(false);
      return;
    }

    loadServiceDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const serviceOverview = item?.overview || {
    clinicName: 'N/A',
    addressLine1: '',
    townCity: '',
    postcode: '',
    primaryProfession: item?.category || 'N/A',
    sessionType: 'N/A',
    sport: 'N/A',
    professionalRegistration: 'N/A',
    insuranceInPlace: 'N/A',
  };

  const fullAddress = [serviceOverview.clinicName, serviceOverview.addressLine1, serviceOverview.townCity, serviceOverview.postcode]
    .filter(Boolean)
    .join(', ');

  const clinicAddress = [serviceOverview.addressLine1, serviceOverview.townCity, serviceOverview.postcode].filter(Boolean).join(', ');

  const providerInitials = String(item?.providerName || 'RW')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  const bookings = useMemo(() => (Array.isArray(item?.bookings) ? item.bookings : []), [item?.bookings]);
  const enquiries = useMemo(() => (Array.isArray(item?.enquiries) ? item.enquiries : []), [item?.enquiries]);

  const [bookingPage, setBookingPage] = useState(1);
  const [enquiryPage, setEnquiryPage] = useState(1);

  const rowsPerPage = 6;

  const bookingTotalPages = Math.max(1, Math.ceil(bookings.length / rowsPerPage));
  const enquiryTotalPages = Math.max(1, Math.ceil(enquiries.length / rowsPerPage));

  useEffect(() => {
    setBookingPage((prev) => Math.min(prev, bookingTotalPages));
  }, [bookingTotalPages]);

  useEffect(() => {
    setEnquiryPage((prev) => Math.min(prev, enquiryTotalPages));
  }, [enquiryTotalPages]);

  const paginatedBookings = useMemo(() => {
    const start = (bookingPage - 1) * rowsPerPage;
    return bookings.slice(start, start + rowsPerPage);
  }, [bookings, bookingPage]);

  const paginatedEnquiries = useMemo(() => {
    const start = (enquiryPage - 1) * rowsPerPage;
    return enquiries.slice(start, start + rowsPerPage);
  }, [enquiries, enquiryPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="" containerClassName="py-0" />
      </div>
    );
  }

  if (error) {
    return <div className="dashboardPy min-h-screen p-4 text-red-600">Error: {error}</div>;
  }

  if (!item) {
    return <div className="dashboardPy min-h-screen p-4">Service not found.</div>;
  }

  return (
    <div className="dashboardPy min-h-screen bg-[#EEF2F3]">
      <div className="rounded-lg">
        <button
          type="button"
          onClick={() => navigate('/provider/add-listing')}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0d655d]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,460px)]">
          <section className="space-y-6">
            <article className="rounded-2xl ">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#111827] text-sm font-semibold text-white shadow-sm">
                  {providerInitials || 'RW'}
                </div>

                <div>
                  <h1 className="text-3xl leading-tight font-semibold text-subtitle md:text-4xl">
                    {item?.providerName || 'Richmond Wellness'}
                  </h1>
                  <p className="mt-0.5 text-sm text-[#4B5563]">
                    Coach: <span className="font-semibold text-[#1D1D1D] text-base">{item?.organizer || 'John Doe'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[#FFFFFF] p-5">
                <h2 className="mb-2 text-xl font-semibold text-[#1D1D1D]">About This Service</h2>
                <p className="text-base leading-relaxed text-[#4B5563]">
                  {item?.about ||
                    'This physiotherapy service is designed specifically for women athletes who play sports like cricket, football, futsal and other physical games. It helps prevent injuries, improve performance, and support recovery so players can stay fit and confident.'}
                </p>
              </div>

              {item?.bookingLink && (
                <div className="mt-4 bg-[#FFFFFF] rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#1A1D1F]">Share this listing.</h3>
                  {item?.status === 'PENDING_APPROVAL' || item?.status === 'PENDING' ? (
                    <p className="text-base text-gray-500 font-medium italic mt-1">
                      You can share after admin approved
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500 mb-3">
                        Use this link to share your ESSA Hub listing on your website, social media or messages.
                      </p>
                      <div className="flex items-center gap-3 w-full">
                        <a
                          href={item.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-[#0F766E] font-medium hover:underline text-sm md:text-base break-all block font-mono bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          {item.bookingLink}
                        </a>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D655D] text-white px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors shrink-0 cursor-pointer shadow-sm"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" /> Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </article>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-[#1D1D1D]">Service Overview</h3>
              <div className="rounded-2xl border border-[#DDE4E8] bg-[#F9FBFB] p-4 shadow-[0_2px_10px_rgba(15,118,110,0.08)] md:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <div>
                    <div className="space-y-3">
                      <ServiceOverviewItem
                        icon={<MapPin className="h-5 w-5" />}
                        label={serviceOverview.clinicName || 'Clinic'}
                        value={clinicAddress || fullAddress || '-'}
                      />
                      <ServiceOverviewItem
                        icon={<FileBadge2 className="h-5 w-5" />}
                        label="Professional registration / qualifications."
                        value={serviceOverview.professionalRegistration || '-'}
                      />
                      <ServiceOverviewItem
                        icon={<ShieldCheck className="h-5 w-5" />}
                        label="Insurance in place"
                        value={serviceOverview.insuranceInPlace || '-'}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-3">
                      <ServiceOverviewItem
                        icon={<Briefcase className="h-5 w-5" />}
                        label="Service type"
                        value={serviceOverview.primaryProfession || '-'}
                      />
                      <ServiceOverviewItem
                        icon={<CalendarDays className="h-5 w-5" />}
                        label="Delivery type"
                        value={serviceOverview.sessionType || '-'}
                      />
                      <ServiceOverviewItem icon={<Trophy className="h-5 w-5" />} label="Sports supported" value={serviceOverview.sport || '-'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="mt-2 flex items-center gap-2">
              <button
                disabled
                className="rounded-md bg-gray-300 px-6 py-3.5 text-base font-semibold text-gray-500 cursor-not-allowed transition opacity-60 shadow-sm"
              >
                Book Now
              </button>
            </div> */}
          </section>

          <aside className="h-fit xl:sticky xl:top-6">
            <div className="rounded-xl bg-[#E7F1F1] p-4">
              <h3 className="text-xl font-semibold text-[#111827]">Contact</h3>
              <p className="mt-3 text-lg leading-11 text-[#374151]">Enquire about this service.</p>
              <textarea
                rows={8}
                placeholder="Write your message"
                className="mt-3 w-full resize-none rounded-xl border-0 bg-[#B5D5D2] px-5 py-4  outline-none placeholder:text-[#4B5563] focus:ring-2 focus:ring-[#0F766E]"
              />
              <button
                disabled
                className="mt-6 rounded-lg bg-gray-300 px-10 py-3 text-base font-semibold text-gray-500 cursor-not-allowed transition opacity-60 shadow-sm"
              >
                Send enquiry
              </button>
            </div>
          </aside>
        </div>

        <section className="mt-4 rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-2xl font-semibold text-[#1D1D1D]">Bookings</h3>
          </div>
          <div className="space-y-3 p-4 md:hidden">
            {paginatedBookings.map((booking, idx) => (
              <article key={`${booking.email}-${idx}`} className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
                <h4 className="text-base font-semibold text-[#1D1D1D]">
                  {booking.fullName || booking.user?.name || booking.name || '—'}
                </h4>
                <div className="mt-2 space-y-1.5 text-sm text-[#4B5563]">
                  <p>
                    <span className="font-semibold text-[#1D1D1D]">Phone:</span>{' '}
                    {booking.phoneNumber?.trim() || booking.user?.phone?.trim() || booking.phone || '—'}
                  </p>
                  <p className="break-all">
                    <span className="font-semibold text-[#1D1D1D]">Email:</span> {booking.email}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-245 w-full border-collapse">
              <thead>
                <tr className="bg-[#F8FAFA] text-left">
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Name</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                  <th className="px-4 py-3 text-base font-medium text-[#1D1D1D]">Email</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking, idx) => (
                  <tr key={`${booking.email}-${idx}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-base text-[#2F3B3A]">
                      {booking.fullName || booking.user?.name || booking.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-base text-[#2F3B3A]">
                      {booking.phoneNumber?.trim() || booking.user?.phone?.trim() || booking.phone || '—'}
                    </td>
                    <td className="break-all px-4 py-3 text-base text-[#2F3B3A]">{booking.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            currentPage={bookingPage}
            totalPages={bookingTotalPages}
            totalResults={bookings.length}
            resultsPerPage={rowsPerPage}
            onPageChange={(p) => setBookingPage(Math.max(1, Math.min(bookingTotalPages, p)))}
            wrapperClass="border-t border-gray-100 px-4 py-3"
            resultsTextClass="text-sm text-[#0F766E]"
            buttonClass="px-3 py-1 text-sm rounded-md"
          />
        </section>

        <section className="mt-4 rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-2xl font-semibold text-[#1D1D1D]">Enquiries</h3>
          </div>
          <div className="space-y-3 p-4 md:hidden">
            {paginatedEnquiries.map((enquiry, idx) => (
              <article key={`${enquiry.id || enquiry.email || idx}`} className="rounded-xl border border-[#E2E8EA] bg-[#F8FAFB] p-4">
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => handleOpenEnquiryModal(enquiry)}
                >
                  <h4 className="text-base font-semibold text-[#1D1D1D]">
                    {enquiry.sender?.name || enquiry.playerName || enquiry.fullName || '—'}
                  </h4>
                  <ChevronRight className="mt-0.5 h-5 w-5 text-[#1D1D1D]" />
                </div>
                <div className="mt-2 space-y-1.5 text-sm text-[#4B5563]">
                  <p>
                    <span className="font-semibold text-[#1D1D1D]">Phone:</span>{' '}
                    {enquiry.sender?.phone?.trim() || enquiry.phone || '—'}
                  </p>
                  <p className="break-all">
                    <span className="font-semibold text-[#1D1D1D]">Email:</span>{' '}
                    {enquiry.sender?.email || enquiry.email || '—'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1D1D1D]">Message:</span> {enquiry.message}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1D1D1D]">Date:</span>{' '}
                    {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-GB') : enquiry.date || '—'}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-245 w-full border-collapse">
              <thead>
                <tr className="bg-[#F8FAFA] text-left">
                  <th className="px-4 py-2 text-base font-medium text-[#1D1D1D]">Player Name</th>
                  <th className="px-4 py-2 text-base font-medium text-[#1D1D1D]">Phone Number</th>
                  <th className="px-4 py-2 text-base font-medium text-[#1D1D1D]">Email</th>
                  <th className="px-4 py-2 text-base font-medium text-[#1D1D1D]">Message</th>
                  <th className="px-4 py-2 text-base font-medium text-[#1D1D1D]">Date</th>
                  <th className="px-4 py-2 text-base font-medium text-[#1D1D1D] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEnquiries.map((enquiry, idx) => (
                  <tr key={`${enquiry.id || enquiry.email || idx}`} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-base text-[#2F3B3A]">
                      {enquiry.sender?.name || enquiry.playerName || enquiry.fullName || '—'}
                    </td>
                    <td className="px-4 py-2 text-base text-[#2F3B3A]">
                      {enquiry.sender?.phone?.trim() || enquiry.phone || '—'}
                    </td>
                    <td className="break-all px-4 py-2 text-base text-[#2F3B3A]">
                      {enquiry.sender?.email || enquiry.email || '—'}
                    </td>
                    <td className="max-w-[260px] px-4 py-2 text-base text-[#2F3B3A]">
                      <p className="truncate" title={enquiry.message || enquiry.msg || ''}>
                        {enquiry.message || enquiry.msg || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-2 text-base text-[#2F3B3A]">
                      {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-GB') : enquiry.date || '—'}
                    </td>
                    <td className="px-4 py-2 text-base text-[#1D1D1D] flex justify-center items-center">
                      <button
                        onClick={() => handleOpenEnquiryModal(enquiry)}
                        className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 cursor-pointer"
                        aria-label="View Details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            currentPage={enquiryPage}
            totalPages={enquiryTotalPages}
            totalResults={enquiries.length}
            resultsPerPage={rowsPerPage}
            onPageChange={(p) => setEnquiryPage(Math.max(1, Math.min(enquiryTotalPages, p)))}
            wrapperClass="border-t border-gray-100 px-4 py-3"
            resultsTextClass="text-sm text-[#0F766E]"
            buttonClass="px-3 py-1 text-sm rounded-md"
          />
        </section>

        {/* Modal for applicant details */}
        <ApplicantModal
          enquiry={selectedEnquiry}
          serviceId={id}
          onClose={() => setSelectedEnquiry(null)}
        />
      </div>
    </div>
  );
};

export default AddListingDetails;
