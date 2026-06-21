import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Container from '../../../components/layout/Container';
import { GET, POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
import {
  ArrowLeft,
  BriefcaseMedical,
  Target,
  Medal,
  FileCheck,
  ShieldCheck,
  Hospital,
  X,
  User,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';

/* ─── Registration Confirmation Modal ──────────────────────────────────────── */
const BookingConfirmModal = ({ isOpen, onClose, onConfirm, user, serviceTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#1A1D1F]">Confirm Registration</h2>
            <p className="mt-0.5 text-sm text-[#4A5565]">{serviceTitle}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info that will be sent */}
        <div className="px-6 py-5">
          <p className="mb-4 text-sm text-[#4A5565]">
            The following information will be submitted with your registration request:
          </p>

          <div className="space-y-3 rounded-xl bg-[#F4FAF9] p-4 border border-[#D1EDE9]">
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E0F2EE] text-[#147B6B]">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#8A9BAE]">Full Name</p>
                <p className="text-sm font-semibold text-[#1A1D1F]">
                  {user?.name || user?.fullName || '—'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E0F2EE] text-[#147B6B]">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#8A9BAE]">Email</p>
                <p className="text-sm font-semibold text-[#1A1D1F]">{user?.email || '—'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E0F2EE] text-[#147B6B]">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#8A9BAE]">Phone Number</p>
                <p className="text-sm font-semibold text-[#1A1D1F]">
                  {user?.phone || user?.phoneNumber || user?.mobile || '—'}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#8A9BAE]">
            Type: <span className="font-semibold text-[#147B6B]">registration</span>
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#1A1D1F] hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#147B6B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D655D] transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registering…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Registration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────── */
const ServiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!location.state?.item);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Booking modal state
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [isInterest, setIsInterest] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchDetail = async () => {
      if (item) return;
      setLoading(true);
      setError(null);
      try {
        const res = await GET(ENDPOINT.SERVICES.DETAIL(id));
        let payload = res?.data;
        if (payload && payload.data) payload = payload.data;
        if (payload && payload.service) payload = payload.service;
        if (mounted) setItem(payload || null);
      } catch (err) {
        if (mounted) setError(err?.response?.data?.message || err.message || 'Failed to load service');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDetail();
    return () => { mounted = false; };
  }, [id, item]);

  /* ── Book Now handler ── */
  const handleBookNowClick = () => {
    if (!isAuthenticated || !user) {
      toast.info('Please log in to register for this service.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setShowBookModal(true);
  };

  /* ── Register Interest handler ── */
  const handleRegisterInterest = async () => {
    if (!isAuthenticated || !user) {
      toast.info('Please log in to register interest.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      setIsInterest(true);
      const response = await POST(ENDPOINT.SERVICES.INTEREST(id), {});
      const msg = response?.data?.message || 'Interest registered successfully!';
      await Swal.fire({
        icon: 'success',
        title: 'Interest Registered!',
        text: msg,
        confirmButtonColor: '#147B6B',
        confirmButtonText: 'Great!',
        timer: 4000,
        timerProgressBar: true,
      });
    } catch (intErr) {
      const errMsg = intErr?.response?.data?.message || 'Failed to register interest. Please try again.';
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errMsg,
        confirmButtonColor: '#147B6B',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsInterest(false);
    }
  };

  /* ── Confirm booking API call ── */
  const handleConfirmBooking = async () => {
    setBookLoading(true);
    try {
      const bookingPayload = {
        serviceId: id,
        userId: user?.id,
        fullName: user?.name || user?.fullName || '',
        email: user?.email,
        phoneNumber: user?.phone || user?.phoneNumber || user?.mobile || '',
        type: 'booking',
      };

      await POST(ENDPOINT.SERVICES.BOOK(id), bookingPayload);
      setShowBookModal(false);
      await Swal.fire({
        icon: 'success',
        title: 'Registration Confirmed!',
        text: 'Your registration request has been submitted. The provider will contact you shortly.',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#147B6B',
        timer: 4000,
        timerProgressBar: true,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setShowBookModal(false);
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: msg,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#147B6B',
      });
    } finally {
      setBookLoading(false);
    }
  };

  /* ── Contact / message submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error('Please write a message before submitting.');
      return;
    }

    if (!isAuthenticated || !user) {
      toast.info('Please log in to send a message.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setSubmitLoading(true);
    try {
      await POST(ENDPOINT.SERVICES.MESSAGES(id), { message: trimmedMessage });
      await Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'The provider will contact you shortly.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#147B6B',
        timer: 3000,
        timerProgressBar: true,
      });
      setMessage('');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to send message';
      await Swal.fire({
        icon: 'error',
        title: 'Message Failed',
        text: msg,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#147B6B',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const displayData = {
    title: item?.listingHeadline || item?.title,
    coach: item?.contactName || item?.provider?.name || item?.providerName,
    avatar: item?.logo || item?.image,
    description: item?.aboutService || item?.description,
    clinicName: item?.clinicName,
    addressLine1: item?.addressLine1,
    townCity: item?.city,
    postcode: item?.postcode,
    profession:
      Array.isArray(item?.providerType) && item.providerType.length > 0
        ? item.providerType.join(', ')
        : item?.role || item?.profession || '—',
    sessionType:
      Array.isArray(item?.sessionTypes) && item.sessionTypes.length > 0
        ? item.sessionTypes.join(', ')
        : item?.sessionType || '—',
    sport:
      Array.isArray(item?.sports) && item.sports.length > 0
        ? item.sports.join(', ')
        : item?.sport || '—',
    professionalRegistration: item?.professionalRegistration || item?.registration,
    insurance:
      item?.insuranceInPlace === true ? 'Yes' : item?.insuranceInPlace === false ? 'No' : item?.insurance,
    participantResponseType: item?.participantResponseType || 'ADD_BOOKING_LINK',
  };

  return (
    <>
      {/* Booking Confirmation Modal */}
      <BookingConfirmModal
        isOpen={showBookModal}
        onClose={() => !bookLoading && setShowBookModal(false)}
        onConfirm={handleConfirmBooking}
        user={user}
        serviceTitle={displayData.title}
        loading={bookLoading}
      />

      <section className="py-6 lg:py-10 bg-[#F8FAFC]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-base font-medium text-[#147B6B] hover:text-[#0D655D] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>

              {loading ? (
                <div className="py-12 text-center text-gray-500">Loading service…</div>
              ) : error ? (
                <div className="py-12 text-center text-red-600">{error}</div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <img
                      src={displayData.avatar}
                      alt={displayData.coach}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                      className="w-[72px] h-[72px] rounded-full object-cover shadow-sm bg-gray-200"
                    />
                    <div>
                      <h1 className="text-[24px] md:text-3xl font-semibold text-[#0B544E] leading-tight">
                        {displayData.title}
                      </h1>
                      <p className="text-[#4A5565] text-base mt-1">
                        Coach: <span className="font-semibold text-[#1A1D1F]">{displayData.coach}</span>
                      </p>
                    </div>
                  </div>

                  {/* About */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="font-bold text-[#1A1D1F] text-lg md:text-xl mb-3">About This Service</h3>
                    <p className="text-[#4A5565] text-[15px] leading-relaxed">{displayData.description}</p>
                  </div>

                  {/* Service Overview */}
                  <h3 className="font-bold text-[#1A1D1F] text-xl mb-4">Service Overview</h3>
                  <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2.5">
                        <h4 className="text-lg font-semibold text-[#1A1D1F]">Location & Clinic</h4>
                        <div className="flex items-start gap-4 rounded-xl bg-[#F8FAFC] p-3.5 border border-[#ECF1F4]">
                          <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center shrink-0">
                            <Hospital className="w-5 h-5 text-[#147B6B]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base text-[#1A1D1F] font-semibold mb-1">{displayData.clinicName}</p>
                            <p className="text-base text-[#4A5565]">
                              {[displayData.addressLine1, displayData.townCity, displayData.postcode]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          </div>
                        </div>
                        <OverviewRow icon={FileCheck} label="Professional Registration" value={displayData.registration} />
                        <OverviewRow icon={ShieldCheck} label="Insurance in place" value={displayData.insurance} />
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-[#1A1D1F] mb-3">Professional Details</h4>
                        <div className="space-y-3">
                          <OverviewRow icon={BriefcaseMedical} label="Primary Profession" value={displayData.profession} />
                          <OverviewRow icon={Target} label="Session Type" value={displayData.sessionType} />
                          <OverviewRow icon={Medal} label="Sport" value={displayData.sport} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {displayData.participantResponseType !== 'ALLOW_REGISTER_INTEREST' ? (
                      <button
                        onClick={handleBookNowClick}
                        className="bg-[#147B6B] hover:bg-[#0D655D] text-white px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors"
                      >
                        Register
                      </button>
                    ) : (
                      <button
                        onClick={handleRegisterInterest}
                        disabled={isInterest}
                        className="bg-[#147B6B] hover:bg-[#0D655D] text-white px-6 py-2.5 rounded-lg text-[14px] font-medium transition-colors disabled:opacity-75"
                      >
                        {isInterest ? 'Registering...' : 'Register Interest'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-45 bg-[#E7F1F1] rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Contact</h3>
                <p className="text-[#1A1D1F] text-base mb-3">Ask the organiser a question</p>
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message"
                    className="w-full bg-[#B5D5D2] rounded-xl p-4 text-base text-[#1A1D1F] placeholder-gray-500 border-none focus:ring-1 focus:ring-[#147B6B] resize-none h-32 mb-4"
                  />
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="bg-btn-primary text-white px-6 py-2.5 rounded-lg text-[14px] font-medium hover:bg-[#0D655D] transition-colors w-fit disabled:opacity-70"
                  >
                    {submitLoading ? 'Sending...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

/* ─── Reusable Overview Row ───────────────────────────────────────────── */
const OverviewRow = ({ icon, label, value }) => {
  const IconComponent = icon;
  return (
    <div className="flex items-start gap-4 rounded-xl bg-[#F8FAFC] p-3.5 border border-[#ECF1F4]">
      <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center shrink-0">
        {React.createElement(IconComponent, { className: 'w-5 h-5 text-[#147B6B]' })}
      </div>
      <div className="min-w-0">
        <p className="text-base text-[#1A1D1F] font-semibold mb-0.5">{label}</p>
        <p className="text-base text-[#4A5565] wrap-break-word">{value}</p>
      </div>
    </div>
  );
};

export default ServiceDetails;