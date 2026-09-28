import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { PATCH } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';
import { handleImageLoadError, resolveImageUrl } from '../../utils/resolveImageUrl';

const FIELD_LABELS = {
  listingHeadline: 'Title',
  title: 'Title',
  aboutService: 'About',
  description: 'Description',
  costMemebershipDetail: 'Cost or membership details',
  costType: 'Cost type',
  costDetails: 'Cost details',
  registrationFee: 'Price',
  sports: 'Sport',
  sportType: 'Sport',
  eventType: 'Event type',
  sessionTypes: 'Session type',
  suitableFor: 'Suitable for',
  skillLevel: 'Skill level',
  womenOnly: 'Participation',
  whoCanTakePart: 'Who can take part',
  clinicName: 'Venue',
  venueName: 'Venue',
  addressLine1: 'Address',
  city: 'Town / City',
  postcode: 'Postcode',
  postCode: 'Postcode',
  fullAddress: 'Full address',
  location: 'Location',
  googleMapLink: 'Google Maps link',
  frequency: 'Frequency',
  sessonDay: 'Session days',
  availableDays: 'Available days',
  date: 'Date',
  startDate: 'Start date',
  endDate: 'End date',
  timeSlote: 'Time',
  startTime: 'Start time',
  endTime: 'End time',
  minAge: 'Minimum age',
  maxParticipants: 'Maximum participants',
  bookingLink: 'Booking link',
  responseType: 'Response type',
  responseMethods: 'Response methods',
  participantResponseType: 'Participant response',
  professionalRegistration: 'Professional registration',
  insuranceInPlace: 'Insurance in place',
  isOnline: 'Online',
  organizationName: 'Organisation name',
  aboutOrganization: 'About the organisation',
  role: 'Role',
  contactName: 'Contact name',
  providerPhone: 'Phone',
  providerEmail: 'Email',
  organizerName: 'Organiser name',
  organizerPhone: 'Organiser phone',
  organizerEmail: 'Organiser email',
  providerType: 'Provider type',
  image: 'Cover image',
  logo: 'Organisation logo',
};

const IMAGE_FIELDS = ['image', 'logo'];
const DATE_FIELDS = ['startDate', 'endDate'];

const humanize = (value) =>
  String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

const formatValue = (field, value) => {
  if (isEmpty(value)) return 'Not set';
  if (field === 'womenOnly') return value ? 'Women only' : 'Mixed, women welcome';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (DATE_FIELDS.includes(field)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  if (field === 'registrationFee') return `£${Number(value).toFixed(2)}`;
  if (Array.isArray(value)) return value.map((item) => formatValue(null, item)).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  if (field === 'eventType' || /^[A-Z_]+$/.test(String(value))) return humanize(value);
  return String(value);
};

const ImageValue = ({ src, tone }) =>
  isEmpty(src) ? (
    <span className="text-sm text-gray-500">Not set</span>
  ) : (
    <img
      src={resolveImageUrl(src)}
      alt=""
      className={`h-20 w-28 rounded-lg object-cover ring-2 ${tone === 'new' ? 'ring-[#0F766E]' : 'ring-gray-200'}`}
      onError={(e) => handleImageLoadError(e)}
    />
  );

const formatSubmittedAt = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Admin: shows only the fields a provider changed on a live listing (old → new)
 * with actions to publish or discard those changes.
 */
const PendingChangesPanel = ({ entityType = 'service', entityId, diff = [], submittedAt, onResolved }) => {
  const [submitting, setSubmitting] = useState(null);

  if (!entityId || !Array.isArray(diff) || diff.length === 0) return null;

  const endpoints = entityType === 'event' ? ENDPOINT.EVENTS : ENDPOINT.SERVICES;

  const handleAction = async (action) => {
    if (action === 'reject') {
      const result = await Swal.fire({
        title: 'Reject these changes?',
        text: 'The current live version will stay as it is.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
      });
      if (!result.isConfirmed) return;
    }

    setSubmitting(action);
    try {
      const url =
        action === 'approve'
          ? endpoints.APPROVE_PENDING_CHANGES(entityId)
          : endpoints.REJECT_PENDING_CHANGES(entityId);
      const response = await PATCH(url, {});
      const payload = response?.data || response;
      toast.success(payload?.message || (action === 'approve' ? 'Changes approved' : 'Changes rejected'));
      onResolved?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
    } finally {
      setSubmitting(null);
    }
  };

  const submittedLabel = formatSubmittedAt(submittedAt);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900">Changes awaiting approval</h2>
        </div>
        {submittedLabel ? (
          <p className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            Submitted {submittedLabel}
          </p>
        ) : null}
      </div>
      <p className="mb-4 text-sm text-gray-600">
        The current version stays live until you approve. Only the fields that changed are shown below.
      </p>

      <div className="divide-y divide-amber-100 overflow-hidden rounded-lg border border-amber-100 bg-white">
        {diff.map(({ field, oldValue, newValue }) => (
          <div key={field} className="grid grid-cols-1 gap-2 p-3 md:grid-cols-[200px_1fr] md:gap-4">
            <p className="text-sm font-semibold text-gray-900">{FIELD_LABELS[field] || humanize(field)}</p>
            {IMAGE_FIELDS.includes(field) ? (
              <div className="flex flex-wrap items-center gap-3">
                <ImageValue src={oldValue} tone="old" />
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                <ImageValue src={newValue} tone="new" />
              </div>
            ) : (
              <div className="flex min-w-0 flex-col gap-1 text-sm md:flex-row md:items-start md:gap-3">
                <span className="min-w-0 whitespace-pre-wrap break-words text-gray-500 line-through">
                  {formatValue(field, oldValue)}
                </span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-gray-400 md:mt-0.5 md:block" />
                <span className="min-w-0 whitespace-pre-wrap break-words font-semibold text-[#0F766E]">
                  {formatValue(field, newValue)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => handleAction('reject')}
          disabled={Boolean(submitting)}
          className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          {submitting === 'reject' ? 'Rejecting…' : 'Reject changes'}
        </button>
        <button
          type="button"
          onClick={() => handleAction('approve')}
          disabled={Boolean(submitting)}
          className="rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60"
        >
          {submitting === 'approve' ? 'Approving…' : 'Approve changes'}
        </button>
      </div>
    </div>
  );
};

/** Provider: tells the owner their edits are waiting for admin approval. */
export const PendingChangesNotice = ({ show, className = '' }) =>
  show ? (
    <div className={`flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 ${className}`}>
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="text-base font-semibold text-gray-900">Changes awaiting approval</p>
        <p className="text-sm text-gray-600">
          You're seeing your latest edits. The previously approved version stays live until an admin approves these changes.
        </p>
      </div>
    </div>
  ) : null;

export default PendingChangesPanel;
