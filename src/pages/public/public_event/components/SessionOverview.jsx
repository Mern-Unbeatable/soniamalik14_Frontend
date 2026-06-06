import React, { useState } from 'react';
import { Medal, Calendar, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { POST } from '../../../../services/httpMethods';
import { getUser } from '../../../../utils/storage';

const SessionOverview = ({ event }) => {
  const authUser = useSelector((state) => state.auth?.user);
  const currentUser = authUser || getUser();
  const normalizedRole = String(currentUser?.role || '')
    .trim()
    .toLowerCase();
  const isActionAllowed = normalizedRole === 'user';
  const userFullName =
    currentUser?.name ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') ||
    '';
  const userEmail = currentUser?.email || '';
  const userPostcode =
    currentUser?.postcode ||
    currentUser?.postalCode ||
    currentUser?.zipCode ||
    currentUser?.zip ||
    currentUser?.billingAddress?.zipCode ||
    currentUser?.billingAddress?.postalCode ||
    currentUser?.shippingAddress?.zipCode ||
    currentUser?.shippingAddress?.postalCode ||
    '';

  const [interestStatus, setInterestStatus] = useState('idle');
  const [bookingStatus, setBookingStatus] = useState('idle');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: userFullName,
    email: userEmail,
    phoneNumber: currentUser?.phoneNumber || currentUser?.phone || currentUser?.mobile || '',
  });
  const [interestForm, setInterestForm] = useState({
    name: userFullName,
    email: userEmail,
    postcode: userPostcode,
  });

  if (!event) return null;

  const handleRegisterInterest = () => {
    if (!isActionAllowed || interestStatus === 'success') return;
    setInterestForm({
      name: userFullName,
      email: userEmail,
      postcode: userPostcode,
    });
    setShowInterestForm(true);
  };

  const handleBookPlace = () => {
    if (!isActionAllowed || bookingStatus === 'success') return;

    setBookingForm({
      fullName: userFullName,
      email: userEmail,
      phoneNumber: currentUser?.phoneNumber || currentUser?.phone || currentUser?.mobile || '',
    });
    setShowBookingForm(true);
  };

  const handleInterestInputChange = (field, value) => {
    setInterestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingInputChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmInterest = async () => {
    if (!event.id) return;

    const name = String(interestForm.name || '').trim();
    const email = String(interestForm.email || '').trim();
    const postcode = String(interestForm.postcode || '').trim();

    if (!name || !email || !postcode) {
      setInterestStatus('error');
      toast.error('Please provide name, email and postcode to confirm your interest.');
      return;
    }

    setInterestStatus('loading');
    try {
      await POST(`/api/events/${event.id}/interest`, {
        fullName: name,
        email,
        postcode,
      });
      setInterestStatus('success');
      setShowInterestForm(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your interest has been shared with the organiser. They may contact you directly.',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#0F766E',
      });
    } catch (e) {
      setInterestStatus('error');
      toast.error(e?.response?.data?.message || 'Failed to register interest');
    }
  };

  const handleConfirmBooking = async () => {
    if (!event.id) return;

    const fullName = String(bookingForm.fullName || '').trim();
    const email = String(bookingForm.email || '').trim();
    const phoneNumber = String(bookingForm.phoneNumber || '').trim();

    if (!fullName || !email || !phoneNumber) {
      setBookingStatus('error');
      toast.error('Please provide full name, email and phone number to book.');
      return;
    }

    setBookingStatus('loading');

    try {
      const response = await POST(`/api/events/${event.id}/register`, {
        fullName,
        email,
        phoneNumber,
        notes: `Booking request for ${event.title || 'event'}`,
      });

      const successMessage = response?.data?.message || response?.message || 'Booked successfully!';
      setBookingStatus('success');
      setShowBookingForm(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: successMessage,
        confirmButtonText: 'Okay',
        confirmButtonColor: '#0F766E',
      });
    } catch (e) {
      setBookingStatus('error');
      toast.error(e?.response?.data?.message || 'Failed to book your place');
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Session Overview</h3>
      <div className="mb-6 space-y-3">
        {/* Info Row: Sport */}
        <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF2F1] text-[#147B6B]">
            <Medal className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-0.5 text-base font-medium text-[#101828]">Sport</p>
            <p className="text-base text-[#4A5565]">{event.sport}</p>
          </div>
        </div>

        {/* Info Row: Event Type */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF2F1] text-[#147B6B]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-0.5 text-base font-medium text-[#101828]">Event Type</p>
            <p className="text-base text-[#4A5565]">{event.type}</p>
          </div>
        </div>

        {/* Info Row: Suitable For */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF2F1] text-[#147B6B]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-0.5 text-base font-medium text-[#101828]">Suitable For</p>
            <p className="text-base text-[#4A5565]">{event.suitableFor}</p>
          </div>
        </div>

        {/* Info Row: Women's only */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF2F1] text-[#147B6B]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-0.5 text-base font-medium text-[#101828]">Women's only</p>
            <p className="text-base text-[#4A5565]">{event.womensOnly}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="hidden flex-wrap gap-3 md:flex">
        <button
          className={`rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] ${bookingStatus === 'success' || !isActionAllowed ? 'cursor-not-allowed opacity-60' : ''}`}
          onClick={handleBookPlace}
          disabled={!isActionAllowed || bookingStatus === 'loading' || bookingStatus === 'success'}
        >
          {bookingStatus === 'loading'
            ? 'Booking...'
            : bookingStatus === 'success'
              ? 'Booked'
              : 'Book Your Place'}
        </button>
        <button
          className={`rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] ${interestStatus === 'success' || !isActionAllowed ? 'cursor-not-allowed opacity-60' : ''}`}
          onClick={handleRegisterInterest}
          disabled={
            !isActionAllowed || interestStatus === 'loading' || interestStatus === 'success'
          }
        >
          {interestStatus === 'loading'
            ? 'Registering...'
            : interestStatus === 'success'
              ? 'Registered'
              : 'Register Interest'}
        </button>
      </div>

      {showBookingForm && isActionAllowed && bookingStatus !== 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[#1A1D1F]">Book your place</p>
                  <p className="mt-1 text-sm text-[#5B6976]">
                    Confirm your contact details before sending the booking request.
                  </p>
                </div>
                <button
                  className="rounded-md border border-[#D3DDDB] px-2.5 py-1.5 text-sm font-medium text-[#1A1D1F] hover:bg-[#F2F7F6]"
                  onClick={() => setShowBookingForm(false)}
                  disabled={bookingStatus === 'loading'}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-6 px-5 py-5 md:grid-cols-[1.2fr_0.8fr] md:px-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4A5565]">Full name</label>
                  <input
                    type="text"
                    value={bookingForm.fullName}
                    onChange={(e) => handleBookingInputChange('fullName', e.target.value)}
                    className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4A5565]">Email</label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => handleBookingInputChange('email', e.target.value)}
                    className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4A5565]">Phone number</label>
                  <input
                    type="tel"
                    value={bookingForm.phoneNumber}
                    onChange={(e) => handleBookingInputChange('phoneNumber', e.target.value)}
                    className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7FBFA] p-4">
                <p className="text-sm font-semibold text-[#1A1D1F]">Event summary</p>
                <div className="mt-3 space-y-3 text-sm text-[#4A5565]">
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Event:</span> {event.title}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Sport:</span> {event.sport}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Location:</span> {event.location}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Date:</span> {event.day || 'Not set'}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Time:</span> {event.time || 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 md:px-6">
              <button
                className="rounded-lg border border-[#C7D7D4] px-4 py-2.5 text-sm font-medium text-[#1A1D1F] transition-colors hover:bg-[#EEF4F3]"
                onClick={() => setShowBookingForm(false)}
                disabled={bookingStatus === 'loading'}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmBooking}
                disabled={bookingStatus === 'loading'}
              >
                {bookingStatus === 'loading' ? 'Submitting...' : 'Confirm booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInterestForm && isActionAllowed && interestStatus !== 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[#1A1D1F]">Confirm your interest</p>
                <p className="mt-1 text-sm text-[#5B6976]">
                  Please review your details before sharing with the organiser.
                </p>
              </div>
              <button
                className="rounded-md border border-[#D3DDDB] px-2.5 py-1.5 text-sm font-medium text-[#1A1D1F] hover:bg-[#F2F7F6]"
                onClick={() => setShowInterestForm(false)}
                disabled={interestStatus === 'loading'}
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">Name</label>
                <input
                  type="text"
                  value={interestForm.name}
                  onChange={(e) => handleInterestInputChange('name', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">Email</label>
                <input
                  type="email"
                  value={interestForm.email}
                  onChange={(e) => handleInterestInputChange('email', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">Postcode</label>
                <input
                  type="text"
                  value={interestForm.postcode}
                  onChange={(e) => handleInterestInputChange('postcode', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                className="rounded-lg border border-[#C7D7D4] px-4 py-2.5 text-sm font-medium text-[#1A1D1F] transition-colors hover:bg-[#EEF4F3]"
                onClick={() => setShowInterestForm(false)}
                disabled={interestStatus === 'loading'}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmInterest}
                disabled={interestStatus === 'loading'}
              >
                {interestStatus === 'loading' ? 'Confirming...' : 'Confirm interest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionOverview;
